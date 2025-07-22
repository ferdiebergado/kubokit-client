import { authClient } from '$lib/stores';
import type { UsersResponse } from '$lib/users';
import type { PageLoad } from './$types';

export const load = (async () => {
	const res = await authClient.fetch('http://localhost:8888/users');
	const data: UsersResponse = await res.json();

	return {
		users: data.data.users
	};
}) satisfies PageLoad;
