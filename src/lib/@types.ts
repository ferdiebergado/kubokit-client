export type APIResponse<T, E> = {
	message: string;
	data?: T;
	errors?: E;
};

export type UserData = {
	id: string;
	email: string;
	created_at: Date;
	updated_at: Date;
};

export type Users = {
	users: UserData[];
};
