import { api, jsonFetch, type APIResponse } from '$lib';
import { routes } from '$lib/routes';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
	const res = await jsonFetch(
		api + routes.verify,
		{ method: 'POST' },
		{ token: url.searchParams.get('token') }
	);

	if (!res.ok) {
		const { message }: APIResponse<undefined, undefined> = await res.json();
		throw new Error(message);
	}

	throw redirect(303, routes.login);
}) satisfies PageLoad;
