import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';

export const originalFetch = fetch;

export const baseURL = 'http://localhost:8888' as const;

export async function redirectTo(path: string): Promise<void> {
	if (typeof window === 'undefined') {
		throw redirect(303, path);
	}
	return await goto(path);
}
