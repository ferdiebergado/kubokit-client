import { authClient } from '../../state.svelte';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
	authClient.clearSession();
	throw redirect(303, '/');
}) satisfies PageLoad;
