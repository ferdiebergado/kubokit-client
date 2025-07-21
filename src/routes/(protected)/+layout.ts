import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { setTargetURL, user } from '../state.svelte';
import type { LayoutLoad } from './$types';

export const load = (async ({ url }) => {
	if (browser && !user.isAuthenticated) {
		const currentPath = url.pathname + url.search;
		setTargetURL(currentPath);
		throw redirect(302, '/auth/login');
	}
	return {};
}) satisfies LayoutLoad;
