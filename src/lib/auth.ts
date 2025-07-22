import { redirect } from '@sveltejs/kit';
import type { Writable } from 'svelte/store';
import { type User } from './stores';

export class AuthClient {
	readonly #originalFetch = window.fetch;
	readonly #authOrigins = ['http://localhost:8888'];
	#token?: string;
	#tokenExpiry?: number;

	constructor(private user: Writable<User | undefined>) {}

	setToken(token: string | undefined): void {
		this.#token = token;
	}

	setTokenExpiry(expiry: number | undefined): void {
		this.#tokenExpiry = expiry;
	}

	async fetch(resource: RequestInfo | URL, options?: RequestInit): Promise<Response> {
		if (!this.#token || !this.#tokenExpiry) {
			console.error('token/token expiry not set');
			throw redirect(302, '/auth/login');
		}

		const now = Date.now();
		const expiry = now + this.#tokenExpiry / 1000000;

		if (now >= expiry) {
			console.error('token expired.');
			throw redirect(302, '/auth/login');
		}

		try {
			const req = new Request(resource, options);
			const destOrigin = new URL(req.url).origin;
			if (this.#token && this.#authOrigins.includes(destOrigin)) {
				req.headers.set('Authorization', 'Bearer ' + this.#token);
			}

			const res = await this.#originalFetch(req);

			return res;
		} catch (error) {
			console.error('Authenticated fetch error:', error);
			throw error;
		}
	}

	clearSession(): void {
		this.setToken(undefined);
		this.setTokenExpiry(undefined);
		this.user.set(undefined);
	}
}
