// place files you want to import through the `$lib` alias in this folder.
console.log('Loading modules...');

/**
 * Base URL for the API.
 *
 * This is a constant used as the root endpoint for all API requests.
 * You can change this when switching between development and production environments.
 */
export const api = 'http://localhost:8888' as const;

/**
 * Generic shape of an API response.
 *
 * This type models a typical API response with a message, optional `data` on success,
 * and optional `errors` on failure. You can extend it by specifying the expected types
 * for `data` and `errors`.
 *
 * @template T - The expected shape of the `data` field in a successful response.
 * @template E - The expected shape of the `errors` field in an error response.
 *
 * @example
 * type User = { id: string; name: string };
 * type ValidationError = { email?: string; password?: string };
 * const res: APIResponse<User, ValidationError> = {
 *   message: "Invalid input",
 *   errors: { email: "Email is required" }
 * };
 */
export type APIResponse<T, E> = {
	message: string;
	data?: T;
	errors?: E & Readonly<{ error_code?: string }>;
};

/**
 * Stores the original `window.fetch` before any overrides.
 */
export const originalFetch = window.fetch;

/**
 * Performs a `fetch` request with a JSON body and automatically sets the
 * `Content-Type` header to `application/json`.
 *
 * This utility is useful for making POST, PUT, or PATCH requests with a typed JSON payload.
 *
 * @template T - The type of the request body object.
 * @param {RequestInfo | URL} url - The URL to send the request to.
 * @param {Omit<RequestInit, 'body'>} [opts] - Optional fetch options excluding the body.
 * @param {T} [body] - Optional request body object to be serialized as JSON.
 * @returns {Promise<Response>} - A promise resolving to the `Response` object.
 *
 * @example
 * const response = await jsonFetch('/api/user', { method: 'POST' }, { name: 'Alice' });
 * const data = await response.json();
 */
export async function jsonFetch<T extends object>(
	url: RequestInfo | URL,
	opts?: Omit<RequestInit, 'body'>,
	body?: T
): Promise<Response> {
	const optsWithOptionalBody: RequestInit = {
		...opts
	};

	if (body) {
		optsWithOptionalBody.body = JSON.stringify(body);
	}
	const req = new Request(url, optsWithOptionalBody);
	const headers = new Headers(req.headers);
	headers.set('Content-Type', 'application/json');
	return await originalFetch(req, { headers });
}
