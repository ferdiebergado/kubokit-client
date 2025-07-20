type User = {
	id: string;
	email: string;
};

type AuthState = {
	isAuthenticated: boolean;
	user?: User;
	error?: Error;
	isLoading: boolean;
};

const initialAuth: AuthState = {
	isAuthenticated: false,
	isLoading: true
};

export const authState = $state(initialAuth);
