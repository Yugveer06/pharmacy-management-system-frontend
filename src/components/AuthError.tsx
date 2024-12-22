import { ShieldAlert } from "lucide-react";
import React from "react";

interface AuthErrorProps {
	message: string;
}

const AuthError: React.FC<AuthErrorProps> = ({ message }) => {
	return (
		<div className='flex items-center gap-2 rounded-lg text-sm text-red-500'>
			<ShieldAlert size={16} />
			<span>{message}</span>
		</div>
	);
};

export default AuthError;
