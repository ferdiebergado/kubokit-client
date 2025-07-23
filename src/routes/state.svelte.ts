import { api } from '$lib';
import { AuthClient, type AuthClientContext, type User } from '$lib/features/auth';
import { routes } from '$lib/routes';
import { redirect } from '@sveltejs/kit';

let user: User | undefined = $state();

export function getUser() {
	return user;
}

export function setUser(newUser?: User): void {
	user = newUser;
}

const loggedIn = $derived(!!user);

export function isLoggedIn(): boolean {
	return loggedIn;
}

function redirectToLogin(path: string): never {
	throw redirect(303, path);
}

export const originalFetch = window.fetch;

const ctx: AuthClientContext = {
	originalFetch,
	api,
	routes,
	redirectFn: redirectToLogin,
	setUser
};

export const authClient = new AuthClient(ctx);

export const targetURL = { path: '/' };
