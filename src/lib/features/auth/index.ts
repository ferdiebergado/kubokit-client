import { type APIResponse } from '$lib';
import type { routes } from '$lib/routes';

/**
 * Minimal user representation.
 */
export type User = {
	email: string;
};

/**
 * Verification token payload sent for email verification or password reset.
 */
export type UserVerification = {
	token: string;
};

/**
 * Authentication token payload returned by the backend.
 */
export type AuthData = {
	access_token: string;
	refresh_token: string;
	expires_in: number; // Typically a UNIX timestamp in milliseconds
	token_type: string;
};

/**
 * Context passed to the `AuthClient` constructor to configure behavior.
 */
export type AuthClientContext = {
	/** Reference to the original fetch function, used for HTTP requests. */
	originalFetch: typeof window.fetch;

	/** Base URL for the API, used to verify origin. */
	api: string;

	/** Object mapping route names to their respective paths (e.g., `/login`, `/refresh`). */
	routes: typeof routes;

	/** Redirect function used to navigate to login or other pages. */
	redirectFn: (path: string) => Promise<void>;

	/** Callback to clear user state from the application (e.g., reset auth store). */
	clearUser: () => void;
};

/**
 * A client for handling authenticated fetch requests with automatic session renewal.
 */
export class AuthClient {
	readonly #redirectPath: string;
	#data?: AuthData;
	#renewPromise?: Promise<void>;

	/**
	 * Initializes the client with the provided context.
	 * @param context - Contains dependencies such as fetch, routes, and redirect logic.
	 */
	constructor(private readonly context: AuthClientContext) {
		console.log('Auth client initializing...');
		const { routes } = context;
		this.#redirectPath = routes.login;
	}

	/**
	 * Sets the current authentication session.
	 * @param data - The latest AuthData (access and refresh tokens).
	 */
	setData(data: AuthData): void {
		this.#data = data;
	}

	/**
	 * Performs an authenticated fetch request. Automatically renews the session if expired.
	 * Redirects to login if not authenticated.
	 *
	 * @param resource - The resource to fetch.
	 * @param options - Optional fetch options.
	 * @returns The response, or undefined if the user was redirected.
	 */
	async fetch(resource: RequestInfo | URL, options?: RequestInit): Promise<Response> {
		if (!this.#data) {
			await this.#redirect();
			throw new Error('Not logged in.');
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

	/**
	 * Determines if the current session is expired.
	 */
	#isSessionExpired(): boolean {
		return Date.now() >= this.#data!.expires_in;
	}

	/**
	 * Builds a new `Request` with Authorization header if origin matches the API base.
	 * @throws if the request is sent to an unknown origin.
	 */
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

	/**
	 * Handles session renewal using the refresh token.
	 * Ensures only one renewal request runs concurrently.
	 */
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

	/**
	 * Fetches a new access token using the refresh token.
	 * Clears session and redirects if the refresh fails.
	 */
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

	/**
	 * Redirects the user to the login page.
	 */
	async #redirect(): Promise<void> {
		await this.context.redirectFn(this.#redirectPath);
	}

	/**
	 * Clears the local token cache.
	 */
	#clearData(): void {
		this.#data = undefined;
	}

	/**
	 * Clears the session both locally and via context callback.
	 */
	clearSession(): void {
		this.#clearData();
		this.context.clearUser();
		console.log('Logged out.');
	}
}
