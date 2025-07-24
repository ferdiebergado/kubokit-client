export const routes = Object.freeze({
	register: '/auth/register',
	login: '/auth/login',
	refresh: '/auth/refresh',
	verify: '/auth/verify',
	logout: '/auth/logout',
	users: '/users'
} as const);
