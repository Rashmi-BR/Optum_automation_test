import { test, expect } from '../utils/api-test';
import { HOME, HOME_BENEFITS } from '../utils/api-constants';
import {
  expectSuccessResponse,
  expectArrayResponse,
  expectObjectResponse,
  expectPaginatedResponse,
  expectLegalAuthsResponse,
} from '../utils/api-helpers';

test.describe('Home Page APIs', () => {
  test('GET employer rewards returns reward amounts', async ({ request }) => {
    const res = await request.get(HOME.employerRewards);
    const body = await expectObjectResponse(res);
    expect(typeof body.data.totalEarnedRewardsAmt).toBe('number');
    expect(typeof body.data.rewardsBalanceAmt).toBe('number');
  });

  test('GET spotlight items returns array', async ({ request }) => {
    const res = await request.get(HOME.spotlightItems);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('name');
  });

  test('GET top picks returns array', async ({ request }) => {
    const res = await request.get(HOME.topPicks);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('type');
  });

  test('GET my activities (stride) returns data', async ({ request }) => {
    const res = await request.get(HOME.myActivitiesStride);
    await expectObjectResponse(res);
  });

  test('GET my activities (challenge) returns data', async ({ request }) => {
    const res = await request.get(HOME.myActivitiesChallenge);
    await expectObjectResponse(res);
  });

  test('GET my activities (mission) returns data', async ({ request }) => {
    const res = await request.get(HOME.myActivitiesMission);
    await expectObjectResponse(res);
  });

  test('GET my activities (gym check-in) returns data', async ({ request }) => {
    const res = await request.get(HOME.myActivitiesGymCheckin);
    await expectObjectResponse(res);
  });

  test('GET my activities (fitness reimbursement) returns data', async ({ request }) => {
    const res = await request.get(HOME.myActivitiesFitnessReimbursement);
    await expectObjectResponse(res);
  });

  test('GET missions (home, limit=3) returns array', async ({ request }) => {
    const res = await request.get(HOME.missionsHome);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('name');
  });

  test('GET health survey rewardable detail returns object', async ({ request }) => {
    const res = await request.get(HOME.healthSurvey);
    const body = await expectObjectResponse(res);
    expect(body.data).toHaveProperty('name');
    expect(body.data).toHaveProperty('type', 'healthSurvey');
  });

  test('GET health score returns score data', async ({ request }) => {
    const res = await request.get(HOME.healthScore);
    const body = await expectObjectResponse(res);
    expect(typeof body.data.currentHealthScoreAmt).toBe('number');
    expect(typeof body.data.maxHealthScoreAmt).toBe('number');
  });

  test('GET legal auths returns forms', async ({ request }) => {
    const res = await request.get(HOME.legalAuths);
    const body = await expectLegalAuthsResponse(res);
    expect(body.legalAuthForms.length).toBeGreaterThan(0);
    expect(body.legalAuthForms[0]).toHaveProperty('formName');
  });
});
