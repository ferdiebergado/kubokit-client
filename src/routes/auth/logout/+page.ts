import { authClient } from '../../state.svelte';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
	authClient.clearSession();
	console.log('User logged out. Redirecting to home page...');
	throw redirect(303, '/');
}) satisfies PageLoad;
