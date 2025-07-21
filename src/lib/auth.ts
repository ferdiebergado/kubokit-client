import { user, type User } from '../routes/state.svelte';

type TokenExpiry = number | undefined;

export class TokenManager {
	readonly #originalFetch = window.fetch;
	readonly #authOrigins = ['http://localhost:8888'];
	#token = '';
	#tokenExpiry: TokenExpiry;

	constructor(protected user: User) {}

	setToken(token: string): void {
		this.#token = token;
	}

	setTokenExpiry(expiry: TokenExpiry): void {
		this.#tokenExpiry = expiry;
	}

	async fetch(resource: RequestInfo | URL, options?: RequestInit): Promise<Response> {
		if (!this.#token) {
			throw Error('token not set');
		}

		if (!this.#tokenExpiry) {
			throw Error('token expiry not set');
		}

		const now = Date.now();
		const expiry = now + this.#tokenExpiry / 1000000;

		if (now >= expiry) {
			this.reset();
			throw Error('token expired.');
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

	reset(): void {
		this.setToken('');
		this.setTokenExpiry(undefined);
		this.user.isAuthenticated = false;
		this.user.email = '';
	}
}

export const tokenMgr = new TokenManager(user);
