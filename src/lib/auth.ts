import { writable } from 'svelte/store';
import { authState } from '../routes/state.svelte';

export class TokenManager {
	readonly #originalFetch = window.fetch;
	readonly #authOrigins = ['http://localhost:8888'];
	#token = '';

	setToken(token: string): void {
		this.#token = token;
	}

	async fetch(resource: RequestInfo | URL, options?: RequestInit): Promise<Response> {
		try {
			const req = new Request(resource, options);
			const destOrigin = new URL(req.url).origin;
			if (this.#token && this.#authOrigins.includes(destOrigin)) {
				req.headers.set('Authorization', 'Bearer ' + this.#token);
			}

			const res = await this.#originalFetch(req);

			if (res.status === 401) {
				authState.isAuthenticated = false;
				throw new Error('Re-authenticating...');
			}

			return res;
		} catch (error) {
			console.error('Authenticated fetch error:', error);
			throw error;
		}
	}
}

export const tokenMgr = new TokenManager();

export const intendedURL = writable('');
