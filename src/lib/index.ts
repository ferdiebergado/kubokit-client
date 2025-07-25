import { authClient, baseURL, originalFetch } from '../routes/state.svelte';

// place files you want to import through the `$lib` alias in this folder.
console.log('Loading modules...');

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
	errors?: Readonly<{ error_code?: string } & E>;
};

type httpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type RequestOpts = Omit<RequestInit, 'method' | 'body' | 'credentials'>;

export async function apiFetch<T extends object>(
	method: httpMethod,
	path: string,
	isAuthorized = false,
	body?: T,
	opts?: RequestOpts
): Promise<Response> {
	if (!path.startsWith('/')) {
		throw new Error('Path should start with a slash (/).');
	}

	const url = baseURL + path;
	const req = new Request(url, opts);
	const newOpts: RequestInit = { method };
	const headers = new Headers(req.headers);

	if (method !== 'GET') {
		headers.set('Content-Type', 'application/json');
	}

	if (body) {
		newOpts['body'] = JSON.stringify(body);
	}

	newOpts['headers'] = headers;

	if (isAuthorized) {
		return await authClient.fetch(req, newOpts);
	}

	return await originalFetch(req, newOpts);
}

export const api = {
	get(path: string, isAuthorized = false, opts?: RequestOpts) {
		return apiFetch('GET', path, isAuthorized, {}, opts);
	},
	post<T extends object>(path: string, isAuthorized = false, body?: T, opts?: RequestOpts) {
		return apiFetch('POST', path, isAuthorized, body, opts);
	},

	put<T extends object>(path: string, isAuthorized = false, body?: T, opts?: RequestOpts) {
		return apiFetch('PUT', path, isAuthorized, body, opts);
	},

	patch<T extends object>(path: string, isAuthorized = false, body?: T, opts?: RequestOpts) {
		return apiFetch('PATCH', path, isAuthorized, body, opts);
	},

	delete(url: string, isAuthorized = false, opts?: RequestOpts) {
		return apiFetch('DELETE', url, isAuthorized, {}, opts);
	}
};
