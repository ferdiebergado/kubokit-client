import type { APIResponse } from '$lib';
import type { Users } from '$lib/features/users';
import { authClient } from '../../state.svelte';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	await parent();

	const res = await authClient.fetch('http://localhost:8888/users');
	const { data }: APIResponse<Users, undefined> = await res.json();

	if (data) {
		return {
			users: data.users
		};
	}

	return {
		users: []
	};
}) satisfies PageLoad;
