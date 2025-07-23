import { type APIResponse } from '$lib';
import type { routes } from '$lib/routes';

export type User = {
	email: string;
};

export type AuthData = {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	token_type: string;
};

export type AuthClientContext = {
	originalFetch: typeof window.fetch;
	api: string;
	routes: typeof routes;
	redirectFn: (path: string) => Promise<void>;
	setUser: (user?: User) => void;
};

export class AuthClient {
	#data?: AuthData;
	#redirectPath: string;
	#renewPromise?: Promise<void>;

	constructor(private readonly context: AuthClientContext) {
		this.#redirectPath = context.routes.login;
	}

	setData(data?: AuthData): void {
		this.#data = data;
	}

	async fetch(resource: RequestInfo | URL, options?: RequestInit): Promise<Response | undefined> {
		if (!this.#data) {
			console.log('Not logged in.');
			const { redirectFn } = this.context;
			await redirectFn(this.#redirectPath);
			return;
		}

		if (this.#isSessionExpired()) {
			console.log('Session has expired.');
			if (!this.#renewPromise) {
				this.#renewPromise = this.#renewSession().finally(() => {
					this.#renewPromise = undefined;
				});
			} else {
				await this.#renewSession();
			}
		}

		try {
			const req = this.#buildRequest(resource, options);
			return await this.context.originalFetch(req);
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
		if (origin === this.context.api) {
			const headers = new Headers(req.headers);
			const { token_type, access_token } = this.#data!;
			headers.set('Authorization', `${token_type} ${access_token}`);
			return new Request(req, { headers });
		}
		throw new Error('unknown origin');
	}

	async #renewSession(): Promise<void> {
		console.log('Renewing session...');

		const { token_type, refresh_token } = this.#data!;
		const { api, routes, redirectFn } = this.context;
		const res = await this.context.originalFetch(api + routes.refresh, {
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

			await redirectFn(this.#redirectPath);
			return;
		}

		const { data }: APIResponse<AuthData, undefined> = await res.json();
		if (data) {
			this.#data = data;
			console.log('Session renewed.');
		}
	}

	clearSession(): void {
		this.setData(undefined);
		this.context.setUser(undefined);
		console.log('Logged out.');
	}
}
