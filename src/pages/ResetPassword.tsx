import AuthError from "@/components/AuthError";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RippleButton } from "@/components/ui/ripple-button/ripple-button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { z } from "zod";

const formSchema = z.object({
	password: z.string().min(6),
	confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
});

function ResetPassword() {
	const [authError, setAuthError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { token } = useParams();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await axios.post(`/api/auth/reset-password/${token}`, {
				newPassword: values.password,
			});

			console.log("Password reset successful:", response.data);
			navigate("/login");
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				console.error("Password reset failed:", error.response.data.message);
				setAuthError(error.response.data.message);
			} else {
				console.error("Error during password reset:", error);
				setAuthError("An error occurred. Please try again later.");
			}
		}
	}

	return (
		<div className='h-screen w-screen flex items-center justify-center bg-neutral-100'>
			<div className='flex w-[96vw] max-w-[512px] flex-col rounded-lg border border-neutral-200 bg-neutral-50'>
				<header className='flex items-center gap-4 rounded-t-lg bg-neutral-200/50 p-4'>
					<RippleButton
						variant={"outline"}
						className='h-fit px-2 py-1 text-xs shadow-none hover:border-neutral-300'
						onClick={() => navigate("/login")}
					>
						<div className='flex items-center justify-center gap-2'>
							<ChevronLeft size={8} />
							<span>Login</span>
						</div>
					</RippleButton>
					<h1 className='text-xl font-semibold'>Reset Password</h1>
				</header>
				<main className='p-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem className='flex flex-col items-start'>
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<Input type='password' placeholder='New Password' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem className='flex flex-col items-start'>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input type='password' placeholder='Confirm Password' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<RippleButton className='w-full' type='submit'>
								Submit
							</RippleButton>
						</form>
					</Form>
					{authError && (
						<div className='mt-2'>
							<AuthError message={authError} />
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

export default ResetPassword;
