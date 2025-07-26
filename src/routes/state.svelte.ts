console.log('Loading state...');

export const intendedURL = { path: '/' };

type AppState = {
	success: boolean;
	msg: string;
};

const initialStatus: AppState = {
	success: false,
	msg: ''
};

export const appState: AppState = $state(initialStatus);

console.log('State loaded.');
