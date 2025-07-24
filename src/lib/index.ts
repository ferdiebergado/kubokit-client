import { originalFetch } from '../routes/state.svelte';

// place files you want to import through the `$lib` alias in this folder.
console.log('Loading modules...');

export const api = 'http://localhost:8888' as const;

export type APIResponse<T, E> = {
	message: string;
	data?: T;
	errors?: E & { error_code?: string };
};

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
	const res = await originalFetch(req, { headers });
	return res;
}
