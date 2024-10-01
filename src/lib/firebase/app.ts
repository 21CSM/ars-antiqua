import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export class App {
  private static instance: App;
  private auth: Auth;
  private app: FirebaseApp;
  private storage: FirebaseStorage;

  private constructor() {
    if (getApps().length === 0) {
      this.app = initializeApp(firebaseConfig);
    } else {
      this.app = getApps()[0];
    }
    this.auth = getAuth(this.app);
    this.storage = getStorage(this.app);
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  public getAuthInstance(): Auth {
    return this.auth;
  }

  public getStorageInstance(): FirebaseStorage {
    return this.storage;
  }
}