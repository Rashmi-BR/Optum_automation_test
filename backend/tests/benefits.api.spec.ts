import { test, expect } from '../utils/api-test';
import { BENEFITS } from '../utils/api-constants';
import { expectObjectResponse, expectArrayResponse } from '../utils/api-helpers';

test.describe('Benefits Page APIs', () => {
  test('GET other benefits returns benefit list', async ({ request }) => {
    const res = await request.get(BENEFITS.otherBenefits);
    const body = await expectObjectResponse(res);
    expect(body.data).toHaveProperty('otherBenefits');
    expect(Array.isArray(body.data.otherBenefits)).toBe(true);
  });

  test('GET resources returns array', async ({ request }) => {
    const res = await request.get(BENEFITS.resources);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('name');
  });

  test('GET wellness coaching returns coaching data', async ({ request }) => {
    const res = await request.get(BENEFITS.wellnessCoaching);
    const body = await expectObjectResponse(res);
    expect(body.data).toHaveProperty('wellnessCoachingLabel');
    expect(body.data).toHaveProperty('coachingBenefits');
    expect(Array.isArray(body.data.coachingBenefits)).toBe(true);
  });
});
