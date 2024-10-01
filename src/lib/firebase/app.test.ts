import { describe, it, expect, vi, beforeEach } from 'vitest';
import { App } from './app';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

vi.mock('firebase/app', async () => {
  const actual = await vi.importActual('firebase/app');
  return {
    ...actual,
    initializeApp: vi.fn(),
    getApps: vi.fn().mockReturnValue([]),
  };
});

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the singleton instance to test it properly
    (App as any).instance = undefined;
  });

  it('should initialize Firebase app only once', () => {
    const mockAuth = { auth: 'mockAuthInstance' };
    const mockStorage = { storage: 'mockStorageInstance' };
    (getAuth as any).mockReturnValue(mockAuth);
    (getStorage as any).mockReturnValue(mockStorage);

    const app1 = App.getInstance();
    const app2 = App.getInstance();

    expect(initializeApp).toHaveBeenCalledTimes(1);
    expect(getAuth).toHaveBeenCalledTimes(1);
    expect(getStorage).toHaveBeenCalledTimes(1);
    expect(app1).toBe(app2); // Both instances should be the same (singleton pattern)
  });

  it('should return the Firebase auth instance', () => {
    const mockAuth = { auth: 'mockAuthInstance' };
    (getAuth as any).mockReturnValue(mockAuth);

    const app = App.getInstance();
    const authInstance = app.getAuthInstance();

    expect(authInstance).toEqual(mockAuth);
    expect(getAuth).toHaveBeenCalledTimes(1);
  });

  it('should return the Firebase storage instance', () => {
    const mockStorage = { storage: 'mockStorageInstance' };
    (getStorage as any).mockReturnValue(mockStorage);

    const app = App.getInstance();
    const storageInstance = app.getStorageInstance();

    expect(storageInstance).toEqual(mockStorage);
    expect(getStorage).toHaveBeenCalledTimes(1);
  });

  it('should use existing Firebase app if apps already exist', () => {
    const existingApp = { name: 'existingApp' };
    (getApps as any).mockReturnValueOnce([existingApp]);

    App.getInstance();

    expect(initializeApp).not.toHaveBeenCalled();
    expect(getAuth).toHaveBeenCalledTimes(1);
    expect(getStorage).toHaveBeenCalledTimes(1);
    // We're not checking the exact argument here, just that they were called
    expect(getAuth).toHaveBeenCalled();
    expect(getStorage).toHaveBeenCalled();
  });
});