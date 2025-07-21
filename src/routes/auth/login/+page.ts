import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { user } from '../../state.svelte';
import type { PageLoad } from './$types';

export const load = (async () => {
	if (browser && user.isAuthenticated) {
		throw redirect(302, '/');
	}

	return {};
}) satisfies PageLoad;
