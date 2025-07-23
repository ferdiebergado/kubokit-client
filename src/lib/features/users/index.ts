export type UserData = {
	id: string;
	email: string;
	created_at: Date;
	updated_at: Date;
};

export type Users = {
	users: UserData[];
};
