import { describe, it, expect, vi, beforeEach } from 'vitest';
import { App } from './app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
}));

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset the singleton instance to test it properly
        (App as any).instance = undefined;
    });

    it('should initialize Firebase app only once', () => {
        const mockAuth = { auth: 'mockAuthInstance' };
        (getAuth as any).mockReturnValue(mockAuth);
        
        const app1 = App.getInstance();
        const app2 = App.getInstance();

        expect(initializeApp).toHaveBeenCalledTimes(1);
        expect(getAuth).toHaveBeenCalledTimes(1);
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
});
