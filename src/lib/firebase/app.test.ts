import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInitializeApp = vi.fn(() => ({ name: 'mocked-app' }));

vi.mock('./config', () => ({
  firebaseConfig: {
    apiKey: 'mock-api-key',
    authDomain: 'mock-auth-domain',
    projectId: "mock-project-id",
    storageBucket: "mock-storage-bucket",
    messagingSenderId: "mock-messaging-sender-id",
    appId: "mock-app-id",
    measurementId: "mock-measurement-id"
  }
}));

vi.mock('firebase/app', () => ({
  initializeApp: mockInitializeApp
}));

describe('Firebase app initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes Firebase with the correct config', async () => {
    // Import the app module here to ensure it runs after mocks are set up
    const { app } = await import('./app');
    
    expect(mockInitializeApp).toHaveBeenCalledTimes(1);
    expect(mockInitializeApp).toHaveBeenCalledWith(expect.objectContaining({
      apiKey: 'mock-api-key',
      authDomain: 'mock-auth-domain',
      projectId: "mock-project-id",
      storageBucket: "mock-storage-bucket",
      messagingSenderId: "mock-messaging-sender-id",
      appId: "mock-app-id",
      measurementId: "mock-measurement-id"
    }));
    expect(app).toEqual({ name: 'mocked-app' });
  });
});