import { type Page, expect } from '@playwright/test';

export class HealthSurveyPage {
  constructor(private page: Page) {}

  async isSurveyComplete(): Promise<boolean> {
    // Check for various completion indicators
    const indicators = ['100%', 'See my Health Profile', 'Health Profile', 'Ver mi Perfil de Salud'];
    for (const text of indicators) {
      if (await this.page.getByText(text, { exact: true }).first().isVisible({ timeout: 1000 }).catch(() => false)) {
        return true;
      }
    }
    // Also check if we've left the survey page entirely
    const url = this.page.url();
    if (url.includes('health-profile') || url.includes('settings')) {
      return true;
    }
    return false;
  }

  /**
   * Gets a fingerprint of the current survey state using the visible option texts.
   * The SPA keeps background content alive, so we use option texts (which change per question).
   */
  private async getProgress(): Promise<string> {
    // Use the option texts as fingerprint — they change with each question
    const skipPatterns = /finish later|go back|copyright|complete your|about you|health survey|completed|previous|confirm|next|continue|submit|let's go|great job|back|thanks for|terminar después|anterior|encuesta de salud|confirmar|siguiente|enviar|vamos|buen trabajo|\d+\s*\/\s*\d+|^\d+%$/i;
    const options = await this.page.evaluate((skipRe) => {
      const results: string[] = [];
      const allDivs = document.querySelectorAll('div');
      for (const el of allDivs) {
        if (el.querySelector('div')) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.top < 200 || rect.top > window.innerHeight - 50) continue;
        const text = el.textContent?.trim() || '';
        if (!text || text.length > 80 || text.length < 2) continue;
        if (new RegExp(skipRe).test(text)) continue;
        if (text.includes('?')) continue;
        results.push(text);
      }
      return results;
    }, skipPatterns.source);
    return options.join('|');
  }

  /**
   * Detects state and clicks Start, Resume, or returns 'already_complete'.
   */
  async enterSurvey(): Promise<'started' | 'resumed' | 'already_complete'> {
    await this.page.waitForTimeout(3000);

    if (await this.isSurveyComplete()) {
      return 'already_complete';
    }

    // Try "Start" / "Comenzar" button
    for (const startText of ['Start', 'Comenzar']) {
      const startBtn = this.page.getByText(startText, { exact: true });
      if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await startBtn.click();
        await this.page.waitForTimeout(3000);
        return 'started';
      }
    }

    // Try "Resume" / "Reanudar" button
    for (const resumeText of ['Resume', 'Reanudar']) {
      const resumeBtn = this.page.getByText(resumeText, { exact: true });
      if (await resumeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await resumeBtn.click();
        await this.page.waitForTimeout(3000);
        return 'resumed';
      }
    }

    // Maybe already inside the survey questions
    return 'started';
  }

  /**
   * Finds and clicks the first option card in the survey.
   * The survey uses React Native Web styled divs as option cards.
   * Clicking an option auto-advances to the next question.
   */
  async answerCurrentQuestion(): Promise<boolean> {
    await this.page.waitForTimeout(1000);

    // Strategy 1: Text/number inputs — fill ALL visible inputs, then click Confirm/Next
    const textInputs = this.page.getByRole('textbox');
    const inputCount = await textInputs.count();
    let filledAny = false;
    for (let i = 0; i < inputCount; i++) {
      const input = textInputs.nth(i);
      if (await input.isVisible().catch(() => false)) {
        const currentValue = await input.inputValue().catch(() => '');
        // Check if the current value has a validation error nearby
        const hasValError = await input.evaluate((el) => {
          const parent = el.closest('div')?.parentElement;
          return parent?.textContent?.includes('Should be') || false;
        });
        if (!currentValue || hasValError) {
          if (currentValue) await input.clear();
          // Find the nearest label by checking parent container's text
          const labelText = await input.evaluate((el) => {
            // Go up until we find a container that has label-like text (not just the input value)
            let node: Element | null = el.parentElement;
            while (node) {
              // Get text from child elements that are NOT the input
              const children = Array.from(node.children);
              for (const child of children) {
                if (child === el || child.querySelector('input, [role="textbox"]')) continue;
                const text = child.textContent?.trim() || '';
                if (text.length > 2 && text.length < 50) return text;
              }
              node = node.parentElement;
              // Stop at a reasonable depth
              if (node?.children && node.children.length > 5) break;
            }
            return '';
          });
          let value = '100'; // default high enough for most medical ranges
          if (/height.*ft|feet/i.test(labelText)) value = '5';
          else if (/height.*in|inch/i.test(labelText)) value = '8';
          else if (/weight|lbs|pound/i.test(labelText)) value = '150';
          else if (/how old|age/i.test(labelText)) value = '35';
          else if (/hour/i.test(labelText)) value = '7';
          else if (/minute/i.test(labelText)) value = '30';
          else if (/systolic/i.test(labelText)) value = '120';
          else if (/diastolic/i.test(labelText)) value = '80';
          else if (/blood sugar|glucose|a1c/i.test(labelText)) value = '100';
          else if (/cholesterol/i.test(labelText)) value = '200';
          await input.fill(value);
          await this.page.waitForTimeout(500);
          filledAny = true;
        } else {
          filledAny = true; // Already has a value
        }
      }
    }
    if (filledAny) {
      await this.page.waitForTimeout(500);
      // Check for validation errors — if present, try "I don't know" link
      const hasError = await this.page.getByText(/should be equal or|Debe ser igual o/i).first().isVisible().catch(() => false);
      if (hasError) {
        const idk = this.page.getByText("I don't know", { exact: true });
        if (await idk.isVisible().catch(() => false)) {
          await idk.click();
          await this.page.waitForTimeout(2000);
          return true;
        }
      }
      return await this.clickNext();
    }

    // Strategy 2: Native radio inputs
    const radios = this.page.locator('input[type="radio"]');
    const radioCount = await radios.count();
    if (radioCount > 0) {
      for (let i = 0; i < radioCount; i++) {
        const radio = radios.nth(i);
        if (await radio.isVisible().catch(() => false)) {
          const label = this.page.locator(`label[for="${await radio.getAttribute('id')}"]`);
          if (await label.isVisible().catch(() => false)) {
            await label.click();
          } else {
            await radio.click({ force: true });
          }
          await this.page.waitForTimeout(2000);
          return true;
        }
      }
    }

    // Strategy 3: ARIA role="radio"
    const ariaRadios = this.page.locator('[role="radio"]');
    const ariaCount = await ariaRadios.count();
    if (ariaCount > 0) {
      for (let i = 0; i < ariaCount; i++) {
        const radio = ariaRadios.nth(i);
        if (await radio.isVisible().catch(() => false)) {
          await radio.click();
          await this.page.waitForTimeout(2000);
          return true;
        }
      }
    }

    // Strategy 4: Custom card-style options (React Native Web)
    // The option cards are leaf-level divs with short text inside a container.
    // Identify them by finding all visible leaf text nodes that are NOT
    // question text, headers, or navigation elements.
    const optionTexts = await this.page.evaluate(() => {
      const results: string[] = [];
      const allDivs = document.querySelectorAll('div');

      // Known non-option text patterns
      const skipPatterns = /finish later|go back|copyright|complete your|about you|health survey|completed|previous|confirm|next|continue|submit|let's go|great job|back|thanks for|terminar después|anterior|encuesta de salud|confirmar|siguiente|enviar|vamos|buen trabajo|\d+\s*\/\s*\d+|^\d+%$/i;

      for (const el of allDivs) {
        const rect = el.getBoundingClientRect();
        // Must be visible and in the main content area
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.top < 200 || rect.top > window.innerHeight - 50) continue;

        // Must be a leaf node (no child divs) — this targets the actual option text
        if (el.querySelector('div')) continue;

        const text = el.textContent?.trim() || '';
        if (!text || text.length > 80 || text.length < 2) continue;

        // Skip known non-option text
        if (skipPatterns.test(text)) continue;

        // Skip if it looks like a question (contains '?')
        if (text.includes('?')) continue;

        results.push(text);
      }
      return results;
    });

    console.log(`[HealthSurvey] Found option candidates: ${JSON.stringify(optionTexts)}`);

    if (optionTexts.length > 0) {
      // Click the first option using Playwright's locator (triggers proper React events)
      const firstOption = this.page.getByText(optionTexts[0], { exact: true }).first();
      if (await firstOption.isVisible().catch(() => false)) {
        try {
          await firstOption.click({ timeout: 5000 });
          await this.page.waitForTimeout(2000);
          return true;
        } catch {
          // Element may be non-clickable (intercepted by overlay etc.)
          console.log(`[HealthSurvey] Could not click option: ${optionTexts[0]}`);
        }
      }
    }

    return false;
  }

  /**
   * Clicks Next/Continue, falls back to Submit/Done/Finish.
   */
  async clickNext(): Promise<boolean> {
    const buttonTexts = ['Confirm', 'Next', 'Continue', 'Submit', "Let's Go", 'Done', 'Confirmar', 'Siguiente', 'Enviar', 'Vamos'];

    for (const text of buttonTexts) {
      const btn = this.page.getByText(text, { exact: true });
      if (await btn.first().isVisible({ timeout: 1000 }).catch(() => false)) {
        await btn.first().click();
        await this.page.waitForTimeout(2000);
        return true;
      }
    }

    // Scroll down and try again — buttons may be below the fold
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(1000);

    for (const text of buttonTexts) {
      const btn = this.page.getByText(text, { exact: true });
      if (await btn.first().isVisible({ timeout: 1000 }).catch(() => false)) {
        await btn.first().click();
        await this.page.waitForTimeout(2000);
        return true;
      }
    }

    return false;
  }

  /**
   * Loops: answer questions until survey reaches 100%.
   */
  async completeSurveyLoop(maxIterations = 50): Promise<boolean> {
    let lastProgress = '';
    let stuckCount = 0;

    for (let i = 0; i < maxIterations; i++) {
      const progress = await this.getProgress();
      console.log(`[HealthSurvey] Iteration ${i + 1}/${maxIterations} — progress: ${progress || 'unknown'}`);

      // Check if survey is complete
      if (await this.isSurveyComplete()) {
        console.log('[HealthSurvey] Survey is 100% complete!');
        return true;
      }

      // Detect if we're stuck on the same question
      if (progress && progress === lastProgress) {
        stuckCount++;
        if (stuckCount >= 5) {
          console.log('[HealthSurvey] Stuck on same question for 5 iterations — stopping');
          return false;
        }
      } else {
        stuckCount = 0;
        lastProgress = progress;
      }

      // Try to answer the current question (fills inputs, clicks option cards)
      const answered = await this.answerCurrentQuestion();
      if (answered) {
        console.log(`[HealthSurvey] Answered question at iteration ${i + 1}`);
      }

      // Always try to click advance buttons (Submit/Confirm/Next/Let's Go)
      // Some questions require answer + Submit, some auto-advance on answer
      const advanced = await this.clickNext();
      if (advanced) {
        console.log(`[HealthSurvey] Clicked advance button at iteration ${i + 1}`);
      }

      if (!answered && !advanced) {
        console.log(`[HealthSurvey] Could not find answer or advance at iteration ${i + 1}`);
        await this.page.mouse.wheel(0, 300);
        await this.page.waitForTimeout(2000);
      }

      await this.page.waitForTimeout(1000);
    }

    // Check one final time
    return this.isSurveyComplete();
  }

  /**
   * Scrolls down and clicks the "Retake" button on the completed survey landing page.
   */
  async clickRetakeSurvey() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(2000);

    const retakeBtn = this.page.getByText('Retake Survey', { exact: true });
    await expect(retakeBtn.first()).toBeVisible({ timeout: 10_000 });
    await retakeBtn.first().click();
    await this.page.waitForTimeout(3000);
  }

  /**
   * Scrolls to bottom and clicks the specified language option (e.g., "Español").
   */
  async selectLanguage(language: string) {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(2000);

    const langBtn = this.page.getByText(language, { exact: true });
    await expect(langBtn.first()).toBeVisible({ timeout: 10_000 });
    await langBtn.first().click();
    await this.page.waitForTimeout(3000);
  }

  /**
   * Scrolls to bottom and asserts "Español" text is visible.
   */
  async verifyEspanolSelected() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(2000);

    const espanol = this.page.getByText('Español', { exact: true }).first();
    await expect(espanol).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Scrolls to bottom and asserts "English" text is visible.
   */
  async verifyEnglishSelected() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(2000);

    const english = this.page.getByText('English', { exact: true }).first();
    await expect(english).toBeVisible({ timeout: 10_000 });
  }
}
