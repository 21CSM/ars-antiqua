import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FirebaseAuthModule } from './auth';
import { App } from './app';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

vi.mock('firebase/auth', () => ({
	GoogleAuthProvider: vi.fn(),
	signInWithPopup: vi.fn(),
	signOut: vi.fn(),
	onAuthStateChanged: vi.fn(),
}));

vi.mock('./app', () => ({
	App: {
		getInstance: vi.fn(() => ({
			getAuthInstance: vi.fn(() => ({})),
		})),
	},
}));

describe('FirebaseAuthModule', () => {
	let authModule: FirebaseAuthModule;

	beforeEach(() => {
		authModule = new FirebaseAuthModule();
		vi.clearAllMocks(); // Reset mocks before each test
	});

	it('should sign in with Google successfully', async () => {
		const mockUser = { uid: '123', email: 'test@example.com' };
		const mockUserCredential = { user: mockUser };
		(signInWithPopup as any).mockResolvedValueOnce(mockUserCredential);

		const user = await authModule.signInWithGoogle();
		expect(signInWithPopup).toHaveBeenCalledTimes(1);
		expect(user).toEqual(mockUser);
	});

	it('should handle error during sign in with Google', async () => {
		const mockError = new Error('Google sign-in failed');
		(signInWithPopup as any).mockRejectedValueOnce(mockError);

		await expect(authModule.signInWithGoogle()).rejects.toThrow('Google sign-in failed');
		expect(signInWithPopup).toHaveBeenCalledTimes(1);
	});

	it('should sign out successfully', async () => {
		(signOut as any).mockResolvedValueOnce(undefined);

		await authModule.signOut();
		expect(signOut).toHaveBeenCalledTimes(1);
	});

	it('should handle error during sign out', async () => {
		const mockError = new Error('Sign out failed');
		(signOut as any).mockRejectedValueOnce(mockError);

		await expect(authModule.signOut()).rejects.toThrow('Sign out failed');
		expect(signOut).toHaveBeenCalledTimes(1);
	});

	it('should return the current user', () => {
		const mockUser = { uid: '123', email: 'test@example.com' };
		authModule['auth'].currentUser = mockUser;

		const currentUser = authModule.getCurrentUser();
		expect(currentUser).toEqual(mockUser);
	});

	it('should listen to auth state changes', () => {
		const callback = vi.fn();
		const unsubscribe = vi.fn();
		(onAuthStateChanged as any).mockImplementationOnce((auth, cb) => {
			cb({ uid: '123' }); // Simulate a user being passed to callback
			return unsubscribe;
		});

		const returnedUnsubscribe = authModule.onAuthStateChanged(callback);
		expect(onAuthStateChanged).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith({ uid: '123' });
		expect(returnedUnsubscribe).toBe(unsubscribe);
	});
});
