import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';

/**
 * Base URL for the API.
 *
 * This is a constant used as the root endpoint for all API requests.
 * You can change this when switching between development and production environments.
 */
export const baseURL = 'http://localhost:8888' as const;

export async function redirectTo(path: string): Promise<void> {
	if (typeof window === 'undefined') {
		throw redirect(303, path);
	}
	return await goto(path);
}
