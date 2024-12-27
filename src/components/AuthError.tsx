import { ShieldAlert } from "lucide-react";
import React from "react";

interface AuthErrorProps {
	message: string;
	className?: string;
}

const AuthError: React.FC<AuthErrorProps> = ({ message, className }) => {
	return (
		<div className={`flex items-center gap-2 rounded-lg text-sm text-red-500 ${className || ""}`}>
			<ShieldAlert size={16} />
			<span>{message}</span>
		</div>
	);
};

export default AuthError;
