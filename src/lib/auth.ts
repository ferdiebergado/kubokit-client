import type { APIResponse } from './@types';

export type User = {
	email: string;
};

export type AuthData = {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	token_type: string;
};

export class AuthClient {
	#data?: AuthData;
	#renewPromise?: Promise<void>;

	constructor(
		private readonly originalFetch: typeof window.fetch,
		private readonly api: string,
		private readonly routes: Record<string, string>,
		private readonly redirectFn: () => never,
		private readonly setUser: (user?: User) => void
	) {}

	setData(data?: AuthData): void {
		this.#data = data;
	}

	async fetch(resource: RequestInfo | URL, options?: RequestInit): Promise<Response> {
		if (!this.#data) {
			console.log('Not logged in.');
			throw this.redirectFn();
		}

		if (this.#isSessionExpired()) {
			console.log('Session has expired.');
			if (!this.#renewPromise) {
				this.#renewPromise = this.#renewSession().finally(() => {
					this.#renewPromise = undefined;
				});
			}
			await this.#renewSession();
		}

		try {
			const req = this.#buildRequest(resource, options);
			return await this.originalFetch(req);
		} catch (error) {
			console.error('Authenticated fetch error:', error);
			throw error;
		}
	}

	#isSessionExpired(): boolean {
		return Date.now() >= this.#data!.expires_in;
	}

	#buildRequest(resource: RequestInfo | URL, options?: RequestInit): Request {
		const req = new Request(resource, options);
		const { origin } = new URL(req.url);
		if (origin === this.api) {
			const headers = new Headers(req.headers);
			const { token_type, access_token } = this.#data!;
			headers.set('Authorization', `${token_type} ${access_token}`);
			return new Request(req, { headers });
		}
		return req;
	}

	async #renewSession(): Promise<void> {
		console.log('Renewing session...');

		const { token_type, refresh_token } = this.#data!;
		const res = await this.originalFetch(this.api + this.routes.refresh, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${token_type} ${refresh_token}`
			}
		});

		if (!res.ok) {
			if (res.status === 401) {
				console.log('Session expired.');
			}
			this.clearSession();
			throw this.redirectFn();
		}

		const { data }: APIResponse<AuthData, undefined> = await res.json();
		if (data) {
			this.#data = data;
			console.log('Session renewed.');
		}
	}

	clearSession(): void {
		this.setData(undefined);
		this.setUser(undefined);
		console.log('Logged out.');
	}
}
