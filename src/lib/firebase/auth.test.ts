import { describe, it, expect, vi } from 'vitest';
import { getAuth } from 'firebase/auth';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
}));

describe('Firebase Auth Initialization', () => {
  it('should call getAuth and initialize auth', async () => {
    const { auth } = await import('./auth');
    expect(getAuth).toHaveBeenCalled();
    expect(auth).toBeDefined();
  });
});
