import { api, type APIResponse } from '$lib';
import { routes } from '$lib/routes';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { appState } from '../../state.svelte';

export const load = (async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token) {
		appState.msg = 'Invalid verification link.';
		appState.success = false;
		throw redirect(303, routes.login);
	}

	const body = { token };
	const res = await api.post(routes.verify, false, body);
	const { message }: APIResponse<undefined, undefined> = await res.json();
	appState.msg = message;

	if (!res.ok) {
		appState.success = false;
		throw redirect(303, routes.login);
	}

	appState.success = true;
	throw redirect(303, routes.login);
}) satisfies PageLoad;
