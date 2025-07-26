import type { User } from '$lib/features/auth';
import { writable } from 'svelte/store';

console.log('Loading state...');

type AppState = {
	success: boolean;
	msg: string;
};

const initialState: AppState = {
	success: false,
	msg: ''
};

export const appState: AppState = $state(initialState);

export const currentUser = writable<User | undefined>();
export const clearUser = () => currentUser.set(undefined);

export const intendedURL = { path: '/' };

console.log('State loaded.');
