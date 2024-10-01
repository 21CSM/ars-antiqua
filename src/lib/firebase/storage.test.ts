import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FirebaseStorageModule } from './storage';
import { ref, getDownloadURL } from 'firebase/storage';

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  getDownloadURL: vi.fn()
}));

vi.mock('./app', () => ({
  App: {
    getInstance: vi.fn(() => ({
      getStorageInstance: vi.fn(() => ({}))
    }))
  }
}));

global.fetch = vi.fn();

describe('FirebaseStorageModule', () => {
  let storageModule: FirebaseStorageModule;

  beforeEach(() => {
    storageModule = new FirebaseStorageModule();
    vi.clearAllMocks();
  });

  it('should fetch file successfully', async () => {
    const mockFileContent = 'Mock file content';
    const mockUrl = 'https://example.com/file.txt';
    const mockFilePath = 'path/to/file.txt';

    (ref as any).mockReturnValueOnce({});
    (getDownloadURL as any).mockResolvedValueOnce(mockUrl);
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockFileContent)
    });

    const result = await storageModule.fetchFile(mockFilePath);

    expect(ref).toHaveBeenCalledWith({}, mockFilePath);
    expect(getDownloadURL).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toBe(mockFileContent);
  });

  it('should handle HTTP error during file fetch', async () => {
    const mockUrl = 'https://example.com/file.txt';
    const mockFilePath = 'path/to/file.txt';

    (ref as any).mockReturnValueOnce({});
    (getDownloadURL as any).mockResolvedValueOnce(mockUrl);
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    await expect(storageModule.fetchFile(mockFilePath)).rejects.toThrow(
      `Failed to fetch file "${mockFilePath}" from the database. Please try again later.`
    );

    expect(ref).toHaveBeenCalledWith({}, mockFilePath);
    expect(getDownloadURL).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
  });

  it('should handle error during getDownloadURL', async () => {
    const mockFilePath = 'path/to/file.txt';
    const mockError = new Error('Download URL error');

    (ref as any).mockReturnValueOnce({});
    (getDownloadURL as any).mockRejectedValueOnce(mockError);

    await expect(storageModule.fetchFile(mockFilePath)).rejects.toThrow(
      `Failed to fetch file "${mockFilePath}" from the database. Please try again later.`
    );

    expect(ref).toHaveBeenCalledWith({}, mockFilePath);
    expect(getDownloadURL).toHaveBeenCalledTimes(1);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});