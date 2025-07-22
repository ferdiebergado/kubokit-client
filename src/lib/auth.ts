import { redirect } from '@sveltejs/kit';

export type User = {
	email: string;
};

export class AuthClient {
	readonly #originalFetch = window.fetch;
	readonly #authOrigins = ['http://localhost:8888'];
	#token?: string;
	#tokenExpiry?: number;

	constructor(private setUser: (user: User | undefined) => void) {}

	setToken(token: string | undefined): void {
		this.#token = token;
	}

	setTokenExpiry(expiry: number | undefined): void {
		this.#tokenExpiry = expiry;
	}

	async fetch(resource: RequestInfo | URL, options?: RequestInit): Promise<Response> {
		if (!this.#token || !this.#tokenExpiry) {
			console.warn('Not logged in.  Redirecting to login page...');
			throw redirect(303, '/auth/login');
		}

		const now = Date.now();
		const expiry = now + this.#tokenExpiry / 1000000;

		if (now >= expiry) {
			console.warn('Session has expired.  Redirecting to login page...');
			throw redirect(303, '/auth/login');
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
		this.setUser(undefined);
	}
}
