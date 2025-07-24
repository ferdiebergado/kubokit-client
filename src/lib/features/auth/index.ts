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
	clearUser: () => void;
};

export class AuthClient {
	readonly #redirectPath: string;
	#data?: AuthData;
	#renewPromise?: Promise<void>;

	constructor(private readonly context: AuthClientContext) {
		console.log('Auth client initializing...');
		const { routes } = context;
		this.#redirectPath = routes.login;
	}

	setData(data: AuthData): void {
		this.#data = data;
	}

	async fetch(resource: RequestInfo | URL, options?: RequestInit): Promise<Response | undefined> {
		if (!this.#data) {
			console.log('Not logged in.');
			await this.#redirect();
			return;
		}

		if (this.#isSessionExpired()) {
			console.log('Session has expired.');
			await this.#renewSession();
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
		if (this.#renewPromise) {
			console.log('Session renewal already in progress. Awaiting existing promise.');
			return this.#renewPromise;
		}

		this.#renewPromise = this.#fetchNewToken().finally(() => {
			console.log('Session renewal promise settled, clearing.');
			this.#renewPromise = undefined;
		});

		return this.#renewPromise;
	}

	async #fetchNewToken(): Promise<void> {
		const { token_type, refresh_token } = this.#data!;
		const { api, routes } = this.context;
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
			await this.#redirect();
			const data: APIResponse<undefined, undefined> = await res.json();
			const { message } = data;
			throw new Error(message);
		}

		const { data }: APIResponse<AuthData, undefined> = await res.json();
		if (data) {
			this.#data = data;
		}
	}

	async #redirect(): Promise<void> {
		await this.context.redirectFn(this.#redirectPath);
	}

	#clearData(): void {
		this.#data = undefined;
	}

	clearSession(): void {
		this.#clearData();
		this.context.clearUser();
		console.log('Logged out.');
	}
}
