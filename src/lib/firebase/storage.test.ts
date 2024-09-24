import { describe, it, expect, vi } from 'vitest';
import { getStorage } from 'firebase/storage';

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
}));

describe('Firebase Storage Initialization', () => {
  it('should call getStorage and initialize storage', async () => {
    const { storage } = await import('./storage');
    expect(getStorage).toHaveBeenCalled();
    expect(storage).toBeDefined();
  });
});
