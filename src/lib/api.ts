export type APIResponse<T> = {
	message: string;
	data?: T;
	errors?: Record<string, string>;
};
