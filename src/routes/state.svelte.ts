import { goto } from '$app/navigation';
import { AuthClient, type AuthClientContext, type User } from '$lib/features/auth';
import { routes } from '$lib/routes';
import { redirect } from '@sveltejs/kit';

console.log('Loading state...');

/**
 * Stores the original `window.fetch` before any overrides.
 */
export const originalFetch = window.fetch;

/**
 * Base URL for the API.
 *
 * This is a constant used as the root endpoint for all API requests.
 * You can change this when switching between development and production environments.
 */
export const baseURL = 'http://localhost:8888' as const;

async function redirectTo(path: string): Promise<void> {
	if (typeof window === 'undefined') {
		throw redirect(303, path);
	}
	return await goto(path);
}

export const intendedURL = { path: '/' };

type AppState = {
	success: boolean;
	msg: string;
};

const initialStatus: AppState = {
	success: false,
	msg: ''
};

export const appState: AppState = $state(initialStatus);

export type AuthState = {
	user?: User;
};

export const authState: AuthState = $state({});

const ctx: AuthClientContext = Object.freeze({
	originalFetch,
	api: baseURL,
	routes,
	redirectFn: redirectTo,
	authState
});

export const authClient = new AuthClient(ctx);

console.log('State loaded.');
