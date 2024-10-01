// storage.ts
import { ref, getDownloadURL, type FirebaseStorage } from 'firebase/storage';
import { App } from './app';

export class FirebaseStorageModule {
  private storage: FirebaseStorage;

  constructor() {
    const app = App.getInstance();
    this.storage = app.getStorageInstance();
  }

  public async fetchFile(filePath: string): Promise<string> {
    try {
      const fileRef = ref(this.storage, filePath);
      const url = await getDownloadURL(fileRef);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error fetching file "${filePath}":`, error);
      throw new Error(
        `Failed to fetch file "${filePath}" from the database. Please try again later.`
      );
    }
  }
}

export const storage: FirebaseStorageModule = new FirebaseStorageModule();