import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { intendedURL } from '$lib/auth';
import { authState } from '../state.svelte';
import type { LayoutLoad } from './$types';

export const load = (async ({ url }) => {
	if (browser) {
		if (!authState.isAuthenticated) {
			intendedURL.set(url.pathname + url.search);
			await goto('/auth/login');
			return {};
		}
	}
	return {};
}) satisfies LayoutLoad;
