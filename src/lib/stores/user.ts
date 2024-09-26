import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import { auth } from '$lib/firebase';

function createUserStore() {
  let unsubscribe: (() => void) | undefined;

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.warn('Not in browser environment');
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    };
  }

  const { subscribe } = writable<User | null>(auth.getCurrentUser(), (set) => {
    unsubscribe = auth.onAuthStateChanged((user) => {
      set(user);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  });

  return {
    subscribe,
  };
}

export const user = createUserStore();