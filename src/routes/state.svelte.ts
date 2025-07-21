export type User = {
	email: string;
	isAuthenticated: boolean;
};

const initialState: User = {
	email: '',
	isAuthenticated: false
};

export const user = $state(initialState);

let targetURL = $state('');

export function getTargetURL(): string {
	return targetURL;
}

export function setTargetURL(url: string): void {
	targetURL = url;
}
