import { api, type APIResponse } from '$lib/api';
import type { Users } from '$lib/features/users';
import { routes } from '$lib/routes';
import { error } from '@sveltejs/kit';
import { appState } from '../../state.svelte';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	await parent();

	const res = await api.get(routes.users, true);

	if (!res.ok) {
		const { message }: APIResponse<undefined, undefined> = await res.json();

		appState.msg = message;
		appState.success = false;

		error(res.status, {
			message
		});
	}

	const { data }: APIResponse<Users, undefined> = await res.json();

	return {
		users: data!.users
	};
}) satisfies PageLoad;
