import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
	children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated === false) {
		return <Navigate to='/login' replace />;
	}

	return children;
};

export default ProtectedRoute;
