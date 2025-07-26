import { authClient } from '$lib/features/auth';
import { routes } from '$lib/routes';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
	authClient.clearSession();
	throw redirect(303, routes.login);
}) satisfies PageLoad;
