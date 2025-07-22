import { AuthClient, type User } from '$lib/auth';

let user = $state<User | undefined>();

export function getUser() {
	return user;
}

export function setUser(newUser: User | undefined): void {
	user = newUser;
}

const loggedIn = $derived(!!user);

export function isLoggedIn(): boolean {
	return loggedIn;
}

export const authClient = new AuthClient(setUser);

type TargetURL = {
	path: string;
};

export const targetURL: TargetURL = { path: '/' };
