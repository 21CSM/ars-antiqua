import { describe, it, expect, vi } from 'vitest';
import { getFirestore } from 'firebase/firestore';

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));

describe('Firestore DB Initialization', () => {
  it('should call getFirestore and initialize db', async () => {
    const { db } = await import('./db');
    expect(getFirestore).toHaveBeenCalled();
    expect(db).toBeDefined();
  });
});
