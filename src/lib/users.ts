export type User = {
	id: string;
	email: string;
	created_at: Date;
	updated_at: Date;
};

export type UsersResponse = {
	data: {
		users: User[];
	};
};
