import { goto } from '$app/navigation';
import { tokenMgr } from '$lib/auth';
import { authState } from '../../state.svelte';
import type { PageLoad } from './$types';

export const load = (async () => {
	tokenMgr.setToken('');
	authState.isAuthenticated = false;
	await goto('/');
	return {};
}) satisfies PageLoad;
