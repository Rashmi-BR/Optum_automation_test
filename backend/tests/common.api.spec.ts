import { test, expect } from '../utils/api-test';
import { COMMON, HOME_BENEFITS } from '../utils/api-constants';
import {
  expectSuccessResponse,
  expectArrayResponse,
  expectObjectResponse,
  expectPaginatedResponse,
  expectTokenResponse,
} from '../utils/api-helpers';

test.describe('Common / Global APIs', () => {
  test('GET prelogin returns content', async ({ request }) => {
    const res = await request.get(COMMON.prelogin);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('loginView');
  });

  test('GET prelogin with employerId returns content', async ({ request }) => {
    const res = await request.get(COMMON.preloginWithEmployer);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('loginView');
  });

  test('GET post-login returns eligibility data', async ({ request }) => {
    const res = await request.get(COMMON.postLogin);
    const body = await expectObjectResponse(res);
    expect(body.data).toHaveProperty('eligibilities');
    expect(Array.isArray(body.data.eligibilities)).toBe(true);
  });

  test('GET mission categories returns array', async ({ request }) => {
    const res = await request.get(COMMON.missionCategories);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('name');
    expect(body.data[0]).toHaveProperty('isMissionCategory', true);
  });

  test('GET challenge categories returns array', async ({ request }) => {
    const res = await request.get(COMMON.challengeCategories);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('name');
    expect(body.data[0]).toHaveProperty('isChallengeCategory', true);
  });

  test('GET gift card categories returns array', async ({ request }) => {
    const res = await request.get(COMMON.giftCardCategories);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('name');
  });

  test('GET focus areas returns object data', async ({ request }) => {
    const res = await request.get(COMMON.focusAreas);
    const body = await expectObjectResponse(res);
    expect(body.data).toHaveProperty('activitiesLbl');
  });

  test('GET user points returns balance', async ({ request }) => {
    const res = await request.get(COMMON.userPoints);
    const body = await expectObjectResponse(res);
    expect(typeof body.data.pointsBalanceAmt).toBe('number');
    expect(typeof body.data.totalEarnedPointsAmt).toBe('number');
  });

  test('GET onboarding steps returns setup guide', async ({ request }) => {
    const res = await request.get(COMMON.onboardingSteps);
    const body = await expectObjectResponse(res);
    expect(body.data).toHaveProperty('setupGuideLbl');
  });

  test('GET onboarding steps (first login) returns setup guide', async ({ request }) => {
    const res = await request.get(COMMON.onboardingFirstLogin);
    const body = await expectObjectResponse(res);
    expect(body.data).toHaveProperty('setupGuideLbl');
  });

  test('GET rewardable activities (gatekept) returns paginated', async ({ request }) => {
    const res = await request.get(COMMON.rewardableGatekept);
    await expectPaginatedResponse(res);
  });

  test('GET token details returns hsidToken', async ({ request }) => {
    const res = await request.get(COMMON.tokenDetails);
    await expectTokenResponse(res);
  });

  test('GET banners returns array', async ({ request }) => {
    const res = await request.get(COMMON.banners);
    const body = await expectSuccessResponse(res);
    expect(Array.isArray(body.data)).toBe(true);
  });
});
