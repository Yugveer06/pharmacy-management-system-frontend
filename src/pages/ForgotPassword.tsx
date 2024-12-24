import AuthError from "@/components/AuthError";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RippleButton } from "@/components/ui/ripple-button/ripple-button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

const formSchema = z.object({
	email: z.string().email().min(6),
});

function ForgotPassword() {
	const [authError, setAuthError] = useState<string | null>(null);
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await axios.post("/api/auth/forgot-password", {
				email: values.email,
			});

			console.log("Password reset email sent:", response.data);
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
					<h1 className='text-xl font-semibold'>Forgot Password</h1>
				</header>
				<main className='p-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem className='flex flex-col items-start'>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder='abc@xyz.com' {...field} />
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

export default ForgotPassword;
