import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { authState } from '../../state.svelte';
import type { PageLoad } from './$types';

export const load = (async () => {
	if (browser) {
		if (authState.isAuthenticated) {
			await goto('/');
			return {};
		}
	}

	return {};
}) satisfies PageLoad;
