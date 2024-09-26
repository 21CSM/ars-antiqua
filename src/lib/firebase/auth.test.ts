import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { FirebaseAuthModule, auth } from './auth';

// Mock console.error to prevent error messages in test output
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null
  })),
  GoogleAuthProvider: vi.fn(() => ({})),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn()
}));

describe('FirebaseAuth', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should be instantiated correctly', () => {
    const auth = new FirebaseAuthModule();
    expect(auth).toBeInstanceOf(FirebaseAuthModule);
    expect(getAuth).toHaveBeenCalled();
  });

  describe('signInWithGoogle', () => {
    it('should have a signInWithGoogle method', () => {
      expect(typeof auth.signInWithGoogle).toBe('function');
    });

    it('should call signInWithPopup and return user when successful', async () => {
      const mockUser = { uid: '123' };
      vi.mocked(signInWithPopup).mockResolvedValue({ user: mockUser } as any);

      const result = await auth.signInWithGoogle();

      expect(GoogleAuthProvider).toHaveBeenCalled();
      expect(signInWithPopup).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw and log error when signInWithPopup fails', async () => {
      const mockError = new Error('Sign-in failed');
      vi.mocked(signInWithPopup).mockRejectedValue(mockError);

      await expect(auth.signInWithGoogle()).rejects.toThrow('Sign-in failed');
      expect(mockConsoleError).toHaveBeenCalledWith('Error signing in with Google', mockError);
    });
  });

  describe('signOut', () => {
    it('should have a signOut method', () => {
      expect(typeof auth.signOut).toBe('function');
    });

    it('should call signOut when successful', async () => {
      vi.mocked(signOut).mockResolvedValue(undefined);

      await auth.signOut();

      expect(signOut).toHaveBeenCalled();
    });

    it('should throw and log error when signOut fails', async () => {
      const mockError = new Error('Sign-out failed');
      vi.mocked(signOut).mockRejectedValue(mockError);

      await expect(auth.signOut()).rejects.toThrow('Sign-out failed');
      expect(mockConsoleError).toHaveBeenCalledWith('Error signing out', mockError);
    });
  });

  describe('getCurrentUser', () => {
    it('should have a getCurrentUser method', () => {
      expect(typeof auth.getCurrentUser).toBe('function');
    });

    it('should return the current user', () => {
      const mockUser = { uid: '123' };
      vi.mocked(getAuth).mockReturnValue({ currentUser: mockUser } as any);

      const auth = new FirebaseAuthModule();
      const currentUser = auth.getCurrentUser();

      expect(currentUser).toEqual(mockUser);
    });

    it('should return null if there is no current user', () => {
      vi.mocked(getAuth).mockReturnValue({ currentUser: null } as any);

      const auth = new FirebaseAuthModule();
      const currentUser = auth.getCurrentUser();

      expect(currentUser).toBeNull();
    });
  });

  describe('onAuthStateChanged', () => {
    it('should have an onAuthStateChanged method', () => {
      expect(typeof auth.onAuthStateChanged).toBe('function');
    });

    it('should call onAuthStateChanged with the provided callback', () => {
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();
      vi.mocked(onAuthStateChanged).mockReturnValue(mockUnsubscribe);

      const unsubscribe = auth.onAuthStateChanged(mockCallback);

      expect(onAuthStateChanged).toHaveBeenCalledWith(expect.anything(), mockCallback);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
});