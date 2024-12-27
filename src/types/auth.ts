export enum UserRole {
	ADMIN = 1,
	MANAGER = 2,
	PHARMACIST = 3,
	SALESMAN = 4,
}

export interface User {
	id: string;
	email: string;
	role: string;
	f_name: string;
	l_name: string;
	role_id: UserRole;
	avatar?: string;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean | null;
}
