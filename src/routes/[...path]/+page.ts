import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
	error(404, 'Page not found');
}) satisfies PageLoad;
