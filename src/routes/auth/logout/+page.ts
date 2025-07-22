import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { authClient } from '$lib/stores';

export const load = (async () => {
	authClient.clearSession();
	throw redirect(302, '/');
}) satisfies PageLoad;
