import { api, type APIResponse } from '$lib/api';
import type { Users } from '$lib/features/users';
import { routes } from '$lib/routes';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	await parent();

	const res = await api.get(routes.users, true);
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
