import { goto } from '$app/navigation';
import { api, originalFetch } from '$lib';
import { AuthClient, type AuthClientContext, type User } from '$lib/features/auth';
import { routes } from '$lib/routes';
import { redirect } from '@sveltejs/kit';

console.log('Loading state...');

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

const ctx: AuthClientContext = Object.freeze({
	originalFetch,
	api,
	routes,
	redirectFn: redirectTo,
	clearUser
});

export const authClient = new AuthClient(ctx);

export const intendedURL = { path: '/' };

console.log('State loaded.');
