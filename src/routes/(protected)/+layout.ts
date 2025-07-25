import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { authState, intendedURL } from '../state.svelte';
import { routes } from '$lib/routes';

export const load = (async ({ url }) => {
	if (browser && !authState.user) {
		const currentPath = url.pathname + url.search;
		intendedURL.path = currentPath;
		console.warn('Not logged in.');
		throw redirect(303, routes.login);
	}

	return {};
}) satisfies LayoutLoad;
