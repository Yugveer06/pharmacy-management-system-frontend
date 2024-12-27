import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AuthState, User } from "@/types/auth";

interface AuthContextType {
	isAuthenticated: boolean | null;
	user: User | null;
	checkAuth: () => Promise<{ isAuthenticated: boolean | null; user: User | null }>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		token: null,
		isAuthenticated: null,
	});

	const checkAuth = async () => {
		try {
			const response = await fetch("/api/auth/check", {
				headers: {
					Authorization: `Bearer ${authState.token}`,
				},
			});
			const data = await response.json();

			if (data.isAuthenticated) {
				const newState = {
					...authState,
					user: data.user,
					isAuthenticated: true,
				};
				setAuthState(newState);
				return { isAuthenticated: true, user: data.userDetails };
			} else {
				logout();
				return { isAuthenticated: false, user: null };
			}
		} catch (error) {
			logout();
			return { isAuthenticated: false, user: null };
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const logout = () => {
		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
		setAuthState({ user: null, token: null, isAuthenticated: false });
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: authState.isAuthenticated,
				user: authState.user,
				checkAuth,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
