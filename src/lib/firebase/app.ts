import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config';
import { getAuth, type Auth } from 'firebase/auth';

export class App {
	private static instance: App;
	private auth: Auth;

	private constructor() {
		const app = initializeApp(firebaseConfig);
		this.auth = getAuth(app);
	}

	// Ensure App is a singleton so it initializes only once
	public static getInstance(): App {
		if (!App.instance) {
			App.instance = new App();
		}
		return App.instance;
	}

	public getAuthInstance(): Auth {
		return this.auth;
	}
}
