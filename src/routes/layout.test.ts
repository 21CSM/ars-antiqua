import { load, ssr } from './+layout';
import { expect, test } from 'vitest';

test('layout load function', async () => {
  const result = await load();
  expect(result).toEqual({});
});

test('ssr is false', () => {
  expect(ssr).toBe(false);
});