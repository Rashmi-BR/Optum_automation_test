import { expect, APIResponse } from '@playwright/test';

/**
 * Standard envelope: { title, status: 200, timestamp, data, pagination? }
 * Used by most api.rallyengage.com endpoints.
 */
export async function expectSuccessResponse(response: APIResponse) {
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('title');
  expect(body).toHaveProperty('status', 200);
  expect(body).toHaveProperty('data');
  return body;
}

/**
 * Envelope where `data` is an array.
 */
export async function expectArrayResponse(response: APIResponse, minLength = 0) {
  const body = await expectSuccessResponse(response);
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBeGreaterThanOrEqual(minLength);
  return body;
}

/**
 * Envelope where `data` is a non-null object (not an array).
 */
export async function expectObjectResponse(response: APIResponse) {
  const body = await expectSuccessResponse(response);
  expect(typeof body.data).toBe('object');
  expect(body.data).not.toBeNull();
  return body;
}

/**
 * Envelope with `pagination` field alongside `data`.
 */
export async function expectPaginatedResponse(response: APIResponse) {
  const body = await expectSuccessResponse(response);
  expect(body).toHaveProperty('pagination');
  expect(body.pagination).toHaveProperty('totalResults');
  expect(typeof body.pagination.totalResults).toBe('number');
  return body;
}

/**
 * Avatars envelope: { success: true, status: 200, errors: [], data: [] }
 */
export async function expectAvatarsResponse(response: APIResponse) {
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('success', true);
  expect(body).toHaveProperty('status', 200);
  expect(Array.isArray(body.errors)).toBe(true);
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBeGreaterThan(0);
  return body;
}

/**
 * Token details: { hsidToken } — non-standard, just check 200 + token present.
 */
export async function expectTokenResponse(response: APIResponse) {
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('hsidToken');
  expect(typeof body.hsidToken).toBe('string');
  return body;
}

/**
 * Legal auths: { legalAuthForms: [] } — no standard envelope.
 */
export async function expectLegalAuthsResponse(response: APIResponse) {
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('legalAuthForms');
  expect(Array.isArray(body.legalAuthForms)).toBe(true);
  return body;
}
