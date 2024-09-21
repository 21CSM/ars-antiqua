import { describe, it, expect, vi } from 'vitest';

// Mock Firebase initialization
vi.mock('firebase/app', () => {
  const mockApp = {};
  return {
    initializeApp: vi.fn(() => mockApp)
  };
});

// Import after mocking
import { initializeApp } from 'firebase/app';
import { app } from './config';

describe('Firebase Configuration', () => {
  it('initializes Firebase with all required fields', () => {
    expect(initializeApp).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: expect.any(String),
        authDomain: expect.any(String),
        projectId: expect.any(String),
        storageBucket: expect.any(String),
        messagingSenderId: expect.any(String),
        appId: expect.any(String)
        // Remove measurementId if it's not in your config
      })
    );
  });

  it('exports the initialized app', () => {
    expect(app).toBeDefined();
    expect(app).toBe(vi.mocked(initializeApp).mock.results[0].value);
  });
});