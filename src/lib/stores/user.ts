import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import { auth } from '$lib/firebase';

function createUserStore() {
  let unsubscribe: (() => void) | undefined;

  const { subscribe, set, update } = writable<{ user: User | null; loading: boolean }>({
    user: null,
    loading: true, // Add a loading state to wait for auth to resolve
  });

  if (typeof window !== 'undefined') {
    unsubscribe = auth.onAuthStateChanged((user) => {
      set({ user, loading: false }); // Once Firebase resolves, update user and loading
    });
  }

  return {
    subscribe,
  };
}

export const userStore = createUserStore();
