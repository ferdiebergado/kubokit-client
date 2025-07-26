import { routes } from '$lib/routes';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { currentUser } from '../../state.svelte';
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { api } from '$lib/api';

export const load = (async ({ url }) => {
	if (browser) {
		if (!get(currentUser)) {
			const token = url.searchParams.get('token');
			if (!token) {
				error(404, 'Not found');
			}

			const body = { token };
			const res = await api.post(routes.verify, false, body);

			if (!res.ok) {
				error(404, 'Not found');
			}

			throw redirect(303, routes.login);
		}
		throw redirect(303, '/');
	}
	return {};
}) satisfies PageLoad;
