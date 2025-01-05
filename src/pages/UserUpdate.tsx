import AuthError from "@/components/AuthError";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RippleButton } from "@/components/ui/ripple-button/ripple-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChevronLeft, ImageIcon, LoaderCircle } from "lucide-react";
import { motion as m } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
	f_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
	l_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
	email: z.string().email(),
	phone: z.string().regex(/^\+?[\d\s-]{10,}$/, {
		message: "Please enter a valid phone number",
	}),
	password: z
		.string()
		.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
		.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
		.regex(/\d/, { message: "Password must contain at least one number" })
		.regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@$!%*?&)" })
		.optional()
		.or(z.literal("")),
	avatar: z
		.custom<FileList>()
		.refine(files => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, "File size must be less than 5MB")
		.refine(files => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type), "Only .jpg, .jpeg, .png and .webp files are accepted"),
	role_id: z.string(),
});

function UserUpdate() {
	const { id } = useParams();
	const [error, setError] = useState<string | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const [isUpdating, setIsUpdating] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			f_name: "",
			l_name: "",
			email: "",
			phone: "",
			password: "",
			avatar: undefined,
			role_id: "",
		},
	});

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const token = document.cookie
					.split("; ")
					.find(row => row.startsWith("token="))
					?.split("=")[1];

				const response = await axios.get(`/api/users/id/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				// Check if user has permission to update this user
				const role = location.pathname.split("/")[2]; // Get role from URL
				const roleMap = {
					admin: 1,
					manager: 2,
					pharmacist: 3,
					salesman: 4,
				};

				if (roleMap[role as keyof typeof roleMap] !== response?.data?.role_id) {
					navigate("/404", { replace: true });
					return;
				}

				if (response.data) {
					const userData = response.data;
					form.reset({
						f_name: userData.f_name,
						l_name: userData.l_name,
						email: userData.email,
						phone: userData.phone,
						role_id: userData.role_id.toString(),
					});
					if (userData.avatar) {
						setImagePreview(userData.avatar);
					}
				}
			} catch (error) {
				if (axios.isAxiosError(error) && error.response) {
					console.error(error.response.data.message);
				} else {
					console.error("Failed to load profile data");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, [form]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > MAX_FILE_SIZE) {
				form.setError("avatar", { message: "File size must be less than 5MB" });
				return;
			}
			if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
				form.setError("avatar", { message: "Only .jpg, .jpeg, .png and .webp files are accepted" });
				return;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsUpdating(true);

			const formData = new FormData();
			formData.append("f_name", values.f_name);
			formData.append("l_name", values.l_name);
			formData.append("email", values.email);
			formData.append("phone", values.phone);
			formData.append("role_id", values.role_id);

			if (values.avatar?.[0]) {
				formData.append("avatar", values.avatar[0]);
			}

			const token = document.cookie
				.split("; ")
				.find(row => row.startsWith("token="))
				?.split("=")[1];

			await axios.put(`/api/auth/update-user/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			});

			navigate(`/dashboard/${getRoleDetails().name}/view`);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setError(error.response.data.message);
			} else {
				setError("An error occurred. Please try again later.");
			}
		} finally {
			setIsUpdating(false);
		}
	}

	const getRoleDetails = () => {
		const path = location.pathname;
		if (path.includes("/admin")) return { id: 1, name: "admin", title: "Admin" };
		if (path.includes("/manager")) return { id: 2, name: "manager", title: "Manager" };
		if (path.includes("/pharmacist")) return { id: 3, name: "pharmacist", title: "Pharmacist" };
		if (path.includes("/salesman")) return { id: 4, name: "salesman", title: "Salesman" };
		return { id: 5, name: "user", title: "Users" };
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<LoaderCircle className='animate-spin' />
			</div>
		);
	}

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1, transition: { ease: [0, 0.75, 0.25, 1] } }}
			exit={{ opacity: 0, scale: 0.9, transition: { ease: [0.75, 0, 1, 0.25] } }}
			className='flex flex-1 flex-col bg-neutral-100 p-6'
		>
			<header className='text-left mb-12'>
				<h1 className='text-2xl font-bold'>Edit User</h1>
			</header>
			{isLoading ? (
				<div className='flex justify-center items-center'>
					<LoaderCircle className=' animate-spin' />
				</div>
			) : (
				<div className='flex w-full max-w-[512px] flex-col rounded-lg border border-neutral-200 bg-neutral-50'>
					<header className='flex items-center gap-4 rounded-t-lg bg-neutral-200/50 p-3 sm:p-4'>
						<RippleButton
							variant={"outline"}
							className='active:scale-95 transition-all h-fit px-2 py-1 text-xs shadow-none hover:border-neutral-300'
							onClick={() => navigate(`/dashboard/${getRoleDetails().name}/view`)}
						>
							<div className='flex items-center justify-center gap-2'>
								<ChevronLeft size={8} />
								<span>Back</span>
							</div>
						</RippleButton>
						<h1 className='text-lg sm:text-xl font-semibold'>Update User</h1>
					</header>
					<main className='p-3 sm:p-4'>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
								<div className='flex flex-col sm:flex-row gap-4'>
									<FormField
										control={form.control}
										name='f_name'
										render={({ field }) => (
											<FormItem className='flex flex-col items-start justify-center flex-1'>
												<FormLabel>First Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='l_name'
										render={({ field }) => (
											<FormItem className='flex flex-col items-start justify-center flex-1'>
												<FormLabel>Last Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Email and Phone fields */}
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem className='flex flex-col items-start justify-center flex-1'>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input type='email' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='phone'
									render={({ field }) => (
										<FormItem className='flex flex-col items-start justify-center flex-1'>
											<FormLabel>Phone</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Role Selector */}
								<FormField
									control={form.control}
									name='role_id'
									render={({ field }) => (
										<FormItem className='flex flex-col items-start justify-center flex-1'>
											<FormLabel>Role</FormLabel>
											<Select onValueChange={field.onChange} defaultValue={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Select a role' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='1'>Admin</SelectItem>
													<SelectItem value='2'>Manager</SelectItem>
													<SelectItem value='3'>Pharmacist</SelectItem>
													<SelectItem value='4'>Salesman</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Avatar field */}
								<FormField
									control={form.control}
									name='avatar'
									render={({ field: { onChange, value, ...field } }) => (
										<FormItem className='flex flex-col items-start justify-center flex-1'>
											<FormLabel>Avatar</FormLabel>
											<FormControl>
												<div className='flex flex-col gap-4'>
													<Label
														htmlFor='avatar'
														className={cn(
															"flex h-24 w-24 sm:h-32 sm:w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed",
															"hover:border-neutral-400 hover:bg-neutral-100"
														)}
													>
														{imagePreview ? (
															<img src={imagePreview} alt='Preview' className='h-full w-full rounded-lg object-cover' />
														) : (
															<div className='flex flex-col items-center justify-center text-neutral-500'>
																<ImageIcon className='h-6 w-6 sm:h-8 sm:w-8' />
																<span className='text-xs'>Upload image</span>
															</div>
														)}
													</Label>
													<Input
														id='avatar'
														type='file'
														accept={ACCEPTED_IMAGE_TYPES.join(",")}
														className='hidden'
														onChange={e => {
															handleImageChange(e);
															onChange(e.target.files);
														}}
														{...field}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<RippleButton className='w-full h-9 sm:h-10' type='submit' disabled={isUpdating}>
									{isUpdating ? <LoaderCircle className='animate-spin' /> : "Update User"}
								</RippleButton>
							</form>
						</Form>
						{error && <AuthError message={error} />}
					</main>
				</div>
			)}
		</m.div>
	);
}

export default UserUpdate;
