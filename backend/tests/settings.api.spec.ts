import { test, expect } from '../utils/api-test';
import { SETTINGS } from '../utils/api-constants';
import { expectAvatarsResponse } from '../utils/api-helpers';

test.describe('Settings Page APIs', () => {
  test('GET avatars returns avatar list', async ({ request }) => {
    const res = await request.get(SETTINGS.avatars);
    const body = await expectAvatarsResponse(res);
    expect(body.data[0]).toHaveProperty('url');
    expect(typeof body.data[0].url).toBe('string');
  });
});
