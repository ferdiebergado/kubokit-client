import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { currentUser, intendedURL } from '../state.svelte';
import { routes } from '$lib/routes';
import { get } from 'svelte/store';

export const load = (async ({ url }) => {
	if (browser && !get(currentUser)) {
		const currentPath = url.pathname + url.search;
		intendedURL.path = currentPath;
		console.warn('Not logged in.');
		throw redirect(303, routes.login);
	}

	return {};
}) satisfies LayoutLoad;
