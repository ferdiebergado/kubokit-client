import { goto } from '$app/navigation';
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

async function redirectTo(path: string): Promise<void> {
	if (typeof window === 'undefined') {
		throw redirect(303, path);
	}
	return await goto(path);
}

export const originalFetch = window.fetch;

const ctx: AuthClientContext = {
	originalFetch,
	api,
	routes,
	redirectFn: redirectTo,
	setUser
};

export const authClient = new AuthClient(ctx);

export const targetURL = { path: '/' };
