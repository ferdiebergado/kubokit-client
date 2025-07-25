import { goto } from '$app/navigation';
import { AuthClient, type AuthClientContext, type User } from '$lib/features/auth';
import { routes } from '$lib/routes';
import { redirect } from '@sveltejs/kit';

console.log('Loading state...');

/**
 * Base URL for the API.
 *
 * This is a constant used as the root endpoint for all API requests.
 * You can change this when switching between development and production environments.
 */
export const baseURL = 'http://localhost:8888' as const;

let user: User | undefined = $state();
const loggedIn = $derived(!!user);

export function getUser() {
	return user;
}

export function setUser(newUser: User): void {
	user = newUser;
}

export function clearUser(): void {
	user = undefined;
}

export function isLoggedIn(): boolean {
	return loggedIn;
}

async function redirectTo(path: string): Promise<void> {
	if (typeof window === 'undefined') {
		throw redirect(303, path);
	}
	return await goto(path);
}

/**
 * Stores the original `window.fetch` before any overrides.
 */
export const originalFetch = window.fetch;

const ctx: AuthClientContext = Object.freeze({
	originalFetch,
	api: baseURL,
	routes,
	redirectFn: redirectTo,
	clearUser
});

export const authClient = new AuthClient(ctx);

export const intendedURL = { path: '/' };

type status = {
	success: boolean;
	msg: string;
};

const initialStatus: status = {
	success: false,
	msg: ''
};

export const appState: status = $state(initialStatus);

console.log('State loaded.');
