import { AuthClient } from '$lib/auth';
import { derived, writable } from 'svelte/store';

export type User = {
	email: string;
};

export const user = writable<User | undefined>();

export const authClient = new AuthClient(user);

export const isAuthenticated = derived(user, (currentUser) => !!currentUser);

export const targetURL = writable('/');
