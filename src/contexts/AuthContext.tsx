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
				credentials: "include",
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

	const logout = async () => {
		await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
		setAuthState({ isAuthenticated: false, user: null, token: null });
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
