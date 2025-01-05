import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RippleButton } from "@/components/ui/ripple-button/ripple-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion as m } from "motion/react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import AuthError from "@/components/AuthError";
import { ImageViewer } from "@/components/ui/image-viewer";

type User = {
	id: string;
	f_name: string;
	l_name: string;
	email: string;
	phone?: string;
	role_id: keyof Role;
	avatar: string;
};

type Role = {
	1: "Admin";
	2: "Manager";
	3: "Pharmacist";
	4: "Salesman";
};

const roleMap: Role = {
	1: "Admin",
	2: "Manager",
	3: "Pharmacist",
	4: "Salesman",
};

function ProfileSkeleton() {
	return (
		<m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, transition: { ease: [0, 0.75, 0.25, 1] } }} className='flex flex-1 flex-col bg-neutral-100 p-6'>
			<header className='text-left mb-12'>
				<h1 className='text-2xl font-bold'>Profile</h1>
			</header>
			<div className='z-10 flex w-[96vw] max-w-[512px] flex-col rounded-lg border border-neutral-200 bg-neutral-50'>
				<header className='flex items-center gap-4 rounded-t-lg bg-neutral-200/50 p-4'>
					<Skeleton className='h-6 w-48' />
				</header>
				<main className='p-6 space-y-8'>
					<div className='flex items-center gap-4 pb-4'>
						<Skeleton className='w-24 h-24 rounded-full' />
						<div className='flex flex-col items-start gap-2'>
							<Skeleton className='h-8 w-48' />
							<Skeleton className='h-6 w-24 rounded-full' />
						</div>
					</div>
					<div className='mt-8'>
						<div className='flex flex-col gap-4'>
							<div className='flex flex-col items-start border-b border-b-neutral-100 pb-4 gap-2'>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-5 w-48' />
							</div>
							<div className='flex flex-col items-start border-b border-b-neutral-100 pb-4 gap-2'>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-5 w-48' />
							</div>
							<div className='flex flex-col items-start border-b border-b-neutral-100 pb-4 gap-2'>
								<Skeleton className='h-4 w-24' />
								<div className='flex gap-1 items-center'>
									<Skeleton className='h-5 w-8' />
									<Skeleton className='h-5 w-24' />
								</div>
							</div>
							<div className='space-y-2 pb-4 gap-2'>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-5 w-8/12' />
							</div>
						</div>
						<div className='flex justify-center mt-8 gap-2 flex-col'>
							<Skeleton className='flex items-center justify-center h-10 w-full'>
								<Skeleton className='h-5 w-32'></Skeleton>
							</Skeleton>
							<Skeleton className='flex items-center justify-center h-10 w-full'>
								<Skeleton className='h-5 w-32'></Skeleton>
							</Skeleton>
						</div>
					</div>
				</main>
			</div>
		</m.div>
	);
}

const formSchema = z.object({
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

export default function ProfileView() {
	const [showPassword, setShowPassword] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const { user: currentUser } = useAuth();
	const [authError, setAuthError] = useState<string | null>(null);
	const [deleteLoader, setDeleteLoader] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get(`/api/users/id/${currentUser?.id}`);
				setUser(response.data);
			} catch (error) {
				console.error("error", error);
			} finally {
				setLoading(false);
			}
		};

		if (currentUser?.id) {
			fetchUserData();
		}
	}, [currentUser?.id]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
		},
	});

	if (loading) {
		return <ProfileSkeleton />;
	}

	if (!user) {
		return <div>No user data found</div>;
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setDeleteLoader(true);
			const response = await axios.delete(`/api/auth/delete-own/${user?.id}`, {
				data: {
					password: values.password,
				},
			});

			console.log("Account deleted successfully:", response.data);
			window.location.href = "/";
		} catch (error) {
			setDeleteLoader(false);
			if (axios.isAxiosError(error) && error.response) {
				console.error("Account deletion failed:", error.response.data.message);
				setAuthError(error.response.data.message);
			} else {
				console.error("Error during account deletion:", error);
				setAuthError("An error occurred. Please try again later.");
			}
		}
	}

	return (
		<m.div
			animate={{ opacity: 1, scale: 1, transition: { ease: [0, 0.75, 0.25, 1] } }}
			exit={{ opacity: 0, scale: 0.9, transition: { ease: [0.75, 0, 1, 0.25] } }}
			className='flex flex-1 flex-col bg-neutral-100 p-6'
		>
			<header className='text-left mb-12'>
				<h1 className='text-2xl font-bold'>Profile</h1>
			</header>
			<div className='z-10 flex w-[96vw] max-w-[512px] flex-col overflow-clip rounded-lg border border-neutral-200 bg-neutral-50'>
				<header className='flex items-center gap-4 rounded-t-lg bg-neutral-200/50 p-4'>
					<h2 className='text-xl font-semibold'>Profile Information</h2>
				</header>
				<main>
					<Card className='border-0 shadow-none rounded-none'>
						<CardHeader className='pb-4'>
							<div className='flex items-center gap-4'>
								<ImageViewer imageSrc={user.avatar}>
									<ImageViewer.Trigger>
										<Avatar className='w-24 h-24'>
											<AvatarImage src={user.avatar} alt={user.f_name} />
											<AvatarFallback className='text-2xl'>
												{user.f_name[0]}
												{user.l_name[0]}
											</AvatarFallback>
										</Avatar>
									</ImageViewer.Trigger>
									<ImageViewer.Overlay className='backdrop-blur-[36px] bg-neutral-950/5' />
									<ImageViewer.Content title='Profile Picture' description={user.f_name + " " + user.l_name}></ImageViewer.Content>
								</ImageViewer>
								<div className='flex flex-col items-start gap-2'>
									<h2 className='text-2xl font-bold'>
										{user.f_name} {user.l_name}
									</h2>
									<Badge variant='default' className='bg-indigo-500 hover:bg-indigo-600 cursor-default shadow-none'>
										{roleMap[user.role_id]}
									</Badge>
								</div>
							</div>
						</CardHeader>
						<CardContent className='mt-8'>
							<div className='flex flex-col gap-4'>
								<div className='flex flex-col items-start border-b border-b-neutral-100 pb-4'>
									<span className='text-sm text-muted-foreground'>Email</span>
									<span className='font-medium'>{user.email}</span>
								</div>
								<div className='flex flex-col items-start border-b border-b-neutral-100 pb-4'>
									<span className='text-sm text-muted-foreground'>Phone Number</span>
									<span className='font-medium'>{user.phone || "Not provided"}</span>
								</div>
								<div className='flex flex-col items-start border-b border-b-neutral-100 pb-4'>
									<span className='text-sm text-muted-foreground'>Role</span>
									<div className='flex gap-1 items-center font-medium'>
										<Badge variant='default' className='bg-indigo-500 hover:bg-indigo-600 cursor-default shadow-none'>
											{user.role_id}
										</Badge>
										<Badge variant='outline' className='hover:bg-neutral-100 cursor-default shadow-none p-0 active:scale-95 transition-all'>
											<Link to={`/dashboard/${roleMap[user.role_id].toLowerCase()}/view`} draggable='false' className='p-0'>
												<RippleButton variant='ghost' className='text-xs w-fit h-fit px-2.5 py-0.5'>
													{roleMap[user.role_id]}
												</RippleButton>
											</Link>
										</Badge>
									</div>
								</div>
								<div className='flex flex-col items-start pb-4'>
									<span className='text-sm text-muted-foreground'>User ID</span>
									<span className='font-medium'>{user.id}</span>
								</div>
							</div>

							<div className='flex flex-col gap-2 justify-center mt-8'>
								<RippleButton className='active:scale-[0.98] transition-all p-0 w-full hover:bg-indigo-500'>
									<Link to='/dashboard/profile/edit' className='w-full h-full flex items-center justify-center p-2' draggable='false'>
										Edit Profile
									</Link>
								</RippleButton>

								<AlertDialog>
									<AlertDialogTrigger asChild>
										<RippleButton variant='destructive' className='active:scale-[0.98] transition-all w-full'>
											Delete account
										</RippleButton>
									</AlertDialogTrigger>
									<AlertDialogContent className='p-0 flex w-[96vw] max-w-[512px] flex-col rounded-lg border border-neutral-200 bg-neutral-50 gap-0'>
										<AlertDialogHeader className='flex gap-4 rounded-t-lg bg-neutral-200/50 p-4'>
											<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
										</AlertDialogHeader>
										<AlertDialogDescription asChild className='p-4'>
											<div>
												<span>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</span>
												<Form {...form}>
													<form onSubmit={form.handleSubmit(onSubmit)}>
														<FormField
															control={form.control}
															name='password'
															render={({ field }) => (
																<FormItem className='flex flex-col items-start mt-4'>
																	<FormLabel htmlFor='password'>Password</FormLabel>
																	<FormControl>
																		<div className='relative flex w-full gap-1'>
																			<Input
																				id='password'
																				type={showPassword ? "text" : "password"}
																				placeholder='your password'
																				className='h-8 shadow-none'
																				{...field}
																			/>
																			<RippleButton
																				className='flex w-8 items-center justify-center'
																				size='sm'
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
														{authError && <AuthError className='mt-2' message={authError} />}
													</form>
												</Form>
											</div>
										</AlertDialogDescription>
										<AlertDialogFooter className='p-4'>
											<AlertDialogCancel asChild>
												<RippleButton variant='outline' className='h-8 rounded-md px-3 text-xs'>
													Cancel
												</RippleButton>
											</AlertDialogCancel>
											<AlertDialogAction asChild>
												<RippleButton
													variant='destructive'
													className='h-8 rounded-md px-3 text-xs bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90'
													onClick={form.handleSubmit(onSubmit)}
													disabled={deleteLoader}
												>
													{deleteLoader ? <LoaderCircle className='animate-spin' /> : "Delete Account"}
													<span>Delete Account</span>
												</RippleButton>
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</CardContent>
					</Card>
				</main>
			</div>
		</m.div>
	);
}
