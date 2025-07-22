import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { isLoggedIn, targetURL } from '../state.svelte';

export const load = (async ({ url }) => {
	if (browser && !isLoggedIn()) {
		const currentPath = url.pathname + url.search;
		targetURL.path = currentPath;
		console.warn('Not logged in. Redirecting to login page...');
		throw redirect(303, '/auth/login');
	}

	return {};
}) satisfies LayoutLoad;
