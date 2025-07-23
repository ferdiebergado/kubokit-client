import { api } from '$lib';
import { AuthClient, type User } from '$lib/auth';
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

function redirectToLogin(): never {
	throw redirect(303, routes.login);
}

export const originalFetch = window.fetch;

export const authClient = new AuthClient(originalFetch, api, routes, redirectToLogin, setUser);

export const targetURL = { path: '/' };
