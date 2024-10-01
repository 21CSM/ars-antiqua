import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	type Auth,
	type User,
	type UserCredential
} from 'firebase/auth';
import { App } from './app';

export class FirebaseAuthModule {
	private auth: Auth;

	constructor() {
		const app = App.getInstance();
		this.auth = app.getAuthInstance();
	}

	public signInWithGoogle = async () => {
		const provider: GoogleAuthProvider = new GoogleAuthProvider();
		try {
			const result: UserCredential = await signInWithPopup(this.auth, provider);
			return result.user;
		} catch (error) {
			console.error('Error signing in with Google', error);
			throw error;
		}
	};

	public signOut = async () => {
		try {
			await signOut(this.auth);
		} catch (error) {
			console.error('Error signing out', error);
			throw error;
		}
	};

	public getCurrentUser = (): User | null => {
		return this.auth.currentUser;
	};

	public onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
		return onAuthStateChanged(this.auth, callback);
	};
}

export const auth: FirebaseAuthModule = new FirebaseAuthModule();
