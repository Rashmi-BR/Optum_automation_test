import { test, expect } from '../utils/api-test';
import { REWARDS } from '../utils/api-constants';
import {
  expectObjectResponse,
  expectArrayResponse,
  expectPaginatedResponse,
} from '../utils/api-helpers';

test.describe('Rewards Page APIs', () => {
  test('GET public sweepstakes returns sweepstakes data', async ({ request }) => {
    const res = await request.get(REWARDS.sweepstakesPublic);
    const body = await expectObjectResponse(res);
    expect(body.data).toHaveProperty('enteredSweepstakes');
    expect(body.data).toHaveProperty('notEnteredSweepstakes');
  });

  test('GET private sweepstakes returns sweepstakes data', async ({ request }) => {
    const res = await request.get(REWARDS.sweepstakesPrivate);
    const body = await expectObjectResponse(res);
    expect(body.data).toHaveProperty('enteredSweepstakes');
    expect(body.data).toHaveProperty('notEnteredSweepstakes');
  });

  test('GET auctions returns array', async ({ request }) => {
    const res = await request.get(REWARDS.auctions);
    const body = await expectArrayResponse(res);
    if (body.data.length > 0) {
      expect(body.data[0]).toHaveProperty('id');
      expect(body.data[0]).toHaveProperty('name');
    }
  });

  test('GET my auctions returns paginated', async ({ request }) => {
    const res = await request.get(REWARDS.myAuctions);
    await expectPaginatedResponse(res);
  });

  test('GET offers returns array', async ({ request }) => {
    const res = await request.get(REWARDS.offers);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('name');
  });

  test('GET donations returns array', async ({ request }) => {
    const res = await request.get(REWARDS.donations);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('name');
  });

  test('GET program overview returns reward program details', async ({ request }) => {
    const res = await request.get(REWARDS.programOverview);
    const body = await expectObjectResponse(res);
    expect(body.data).toHaveProperty('aboutTheProgramLbl');
    expect(typeof body.data.rewardMaxCap).toBe('number');
  });
});
