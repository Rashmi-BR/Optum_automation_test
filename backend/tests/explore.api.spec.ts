import { test, expect } from '../utils/api-test';
import { EXPLORE } from '../utils/api-constants';
import { expectArrayResponse, expectObjectResponse } from '../utils/api-helpers';

test.describe('Explore Page APIs', () => {
  test('GET challenges returns array', async ({ request }) => {
    const res = await request.get(EXPLORE.challenges);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('name');
    expect(body.data[0]).toHaveProperty('startDate');
  });

  test('GET team challenges returns array', async ({ request }) => {
    const res = await request.get(EXPLORE.teamChallenges);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('name');
  });

  test('GET user-created challenge options returns object', async ({ request }) => {
    const res = await request.get(EXPLORE.userCreatedOptions);
    const body = await expectObjectResponse(res);
    expect(body.data).toHaveProperty('createChallengeLbl');
    expect(body.data).toHaveProperty('haveInviteCodeLbl');
  });

  test('GET recommended activities returns array', async ({ request }) => {
    const res = await request.get(EXPLORE.recommendedActivities);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('name');
    expect(body.data[0]).toHaveProperty('type');
  });

  test('GET missions (explore, limit=10) returns array', async ({ request }) => {
    const res = await request.get(EXPLORE.missionsExplore);
    const body = await expectArrayResponse(res, 1);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('name');
  });
});
