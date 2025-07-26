import { baseURL } from '$lib';
import { authClient } from './features/auth';

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

	return await fetch(req, newOpts);
}

export const api = {
	get(path: string, isAuthorized = false, opts?: RequestOpts) {
		return apiFetch('GET', path, isAuthorized, undefined, opts);
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
