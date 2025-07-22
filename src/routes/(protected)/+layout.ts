import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { get } from 'svelte/store';
import { isAuthenticated, targetURL } from '$lib/stores';

export const load = (async ({ url }) => {
	if (browser && !get(isAuthenticated)) {
		const currentPath = url.pathname + url.search;
		targetURL.set(currentPath);
		throw redirect(302, '/auth/login');
	}

	return {};
}) satisfies LayoutLoad;
