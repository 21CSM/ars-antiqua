import { describe, it, expect } from 'vitest';
import { firebaseConfig } from './config';

describe('Firebase Configuration', () => {
  it('has all required fields', () => {
    expect(firebaseConfig).toEqual(
      expect.objectContaining({
        apiKey: expect.any(String),
        authDomain: expect.any(String),
        projectId: expect.any(String),
        storageBucket: expect.any(String),
        messagingSenderId: expect.any(String),
        appId: expect.any(String),
        measurementId: expect.any(String)
      })
    );
  });

  it('has valid configuration values', () => {
    expect(firebaseConfig.apiKey).toMatch(/^AIza[0-9A-Za-z-_]{35}$/);
    expect(firebaseConfig.authDomain).toBe('ars-antiqua.firebaseapp.com');
    expect(firebaseConfig.projectId).toBe('ars-antiqua');
    expect(firebaseConfig.storageBucket).toBe('ars-antiqua.appspot.com');
    expect(firebaseConfig.messagingSenderId).toMatch(/^\d+$/);
    expect(firebaseConfig.appId).toMatch(/^1:\d+:web:[a-f0-9]+$/);
    expect(firebaseConfig.measurementId).toMatch(/^G-[A-Z0-9]+$/);
  });
});