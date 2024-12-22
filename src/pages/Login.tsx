import AuthError from "@/components/AuthError";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RippleButton } from "@/components/ui/ripple-button/ripple-button";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const formSchema = z.object({
	email: z.string().email().min(6),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" })
		.regex(/[A-Z]/, {
			message: "Password must contain at least one uppercase letter",
		})
		.regex(/[a-z]/, {
			message: "Password must contain at least one lowercase letter",
		})
		.regex(/\d/, { message: "Password must contain at least one number" })
		.regex(/[@$!%*?&]/, {
			message: "Password must contain at least one special character (@$!%*?&)",
		}),
});

function Login() {
	const [showPassword, setShowPassword] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);

	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/dashboard");
		}
	}, [isAuthenticated]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await axios.post("/api/auth/login", {
				email: values.email,
				password: values.password,
			});

			console.log("Sign in successful:", response.data);
			window.location.href = "/";
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				console.error("Sign in failed:", error.response.data.message);
				setAuthError(error.response.data.message);
			} else {
				console.error("Error during sign in:", error);
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
						onClick={() => navigate("/")}
					>
						<div className='flex items-center justify-center gap-2'>
							<ChevronLeft size={8} />
							<span>Home</span>
						</div>
					</RippleButton>
					<h1 className='text-xl font-semibold'>Sign in</h1>
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
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem className='flex flex-col items-start'>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className='relative flex w-full gap-1'>
												<Input
													type={showPassword ? "text" : "password"}
													placeholder='your password'
													{...field}
												/>
												<RippleButton
													className='flex w-8 items-center justify-center'
													onClick={event => {
														event.preventDefault();
														setShowPassword(!showPassword);
													}}
												>
													{showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
												</RippleButton>
											</div>
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

export default Login;
