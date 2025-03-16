import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { ReactNode } from "react";

interface RoleBasedProps {
	children: ReactNode;
	allowedRoles: UserRole[];
}

export const RoleBasedRender = ({ children, allowedRoles }: RoleBasedProps) => {
	const { user } = useAuth();

	if (!user || !allowedRoles.includes(user.role_id)) {
		return null;
	}

	return <>{children}</>;
};
