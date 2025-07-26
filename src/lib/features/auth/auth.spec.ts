import { describe, expect, it } from 'vitest';
import { AuthClient, type AuthClientContext, type AuthData } from '.';

describe('AuthClient.#buildRequest (indirect test via fetch)', () => {
	it('adds Authorization header if origin matches API base', async () => {
		const originalFetch: typeof fetch = async (input, init) => {
			const req = input instanceof Request ? input : new Request(input, init);

			return new Response(null, {
				status: 200,
				statusText: 'OK',
				headers: req.headers
			});
		};

		const routes = {
			login: '/login',
			refresh: '/refresh'
		};

		const context: AuthClientContext = {
			fetch: originalFetch,
			api: 'https://example.com',
			routes,
			redirectFn: async () => {},
			clearUser: () => {}
		};

		const tokenData: AuthData = {
			access_token: 'abc123',
			refresh_token: 'def456',
			expires_in: Date.now() + 100_000,
			token_type: 'Bearer'
		};

		const client = new AuthClient(context);
		client.setData(tokenData);

		const response = await client.fetch('https://example.com/api/user', {
			method: 'GET'
		});

		const authHeader = response.headers.get('Authorization');
		expect(authHeader).toBe('Bearer abc123');
	});
});
