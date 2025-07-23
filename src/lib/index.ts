// place files you want to import through the `$lib` alias in this folder.
export const api = 'http://localhost:8888' as const;

export type APIResponse<T, E> = {
	message: string;
	data?: T;
	errors?: E;
};
