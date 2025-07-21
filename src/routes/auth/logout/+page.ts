import { tokenMgr } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
	tokenMgr.reset();
	throw redirect(302, '/');
}) satisfies PageLoad;
