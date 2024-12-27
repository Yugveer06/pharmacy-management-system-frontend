import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RippleButton } from "@/components/ui/ripple-button/ripple-button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChevronLeft, Eye, EyeOff, ImageIcon, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { motion as m } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
	f_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
	l_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
	email: z.string().email(),
	phone: z.string().regex(/^\+?[\d\s-]{10,}$/, {
		message: "Please enter a valid phone number",
	}),
	oldPassword: z.string().optional(),
	password: z.string().optional(),
	avatar: z
		.custom<FileList>()
		.refine(files => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, "File size must be less than 5MB")
		.refine(
			files => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
			"Only .jpg, .jpeg, .png and .webp files are accepted"
		)
		.optional(),
});

function EditProfile() {
	const { user } = useAuth();
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);

	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			f_name: "",
			l_name: "",
			email: "",
			phone: "",
			oldPassword: "",
			password: "",
		},
	});

	useEffect(() => {
		const fetchUserData = async () => {
			if (user && user.id) {
				try {
					const token = document.cookie
						.split("; ")
						.find(row => row.startsWith("token="))
						?.split("=")[1];

					const response = await axios.get(`/api/users/id/${user.id}`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (response.data) {
						const userData = response.data;
						form.reset({
							f_name: userData.f_name,
							l_name: userData.l_name,
							email: userData.email,
							phone: userData.phone,
							password: "",
							oldPassword: "",
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
			}
		};

		fetchUserData();
	}, [form, user]);

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
			if (values.oldPassword && values.password) {
				formData.append("oldPassword", values.oldPassword);
				formData.append("password", values.password);
			}
			if (values.avatar?.[0]) {
				formData.append("avatar", values.avatar[0]);
			}

			const token = document.cookie
				.split("; ")
				.find(row => row.startsWith("token="))
				?.split("=")[1];

			const response = await axios.put("/api/auth/edit-profile", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.data.success) {
				navigate("/dashboard/profile");
			} else {
				console.log(response.data.message || "Failed to update profile");
			}
		} catch (error) {
			setIsUpdating(false);
			if (axios.isAxiosError(error) && error.response) {
				console.log(error.response.data.message);
			} else {
				console.log("An error occurred. Please try again later.");
			}
		}
	}

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1, transition: { ease: [0, 0.75, 0.25, 1] } }}
			exit={{ opacity: 0, scale: 0.9, transition: { ease: [0.75, 0, 1, 0.25] } }}
			className='flex flex-1 flex-col bg-neutral-100 p-6'
		>
			<header className='text-left mb-12'>
				<h1 className='text-2xl font-bold'>Edit Profile</h1>
			</header>
			{isLoading ? (
				<div className='flex justify-center items-center'>
					<LoaderCircle className=' animate-spin' />
				</div>
			) : (
				<div className='flex w-[96vw] max-w-[512px] flex-col rounded-lg border border-neutral-200 bg-neutral-50'>
					<header className='flex items-center gap-4 rounded-t-lg bg-neutral-200/50 p-4'>
						<RippleButton
							variant={"outline"}
							className='active:scale-95 transition-all h-fit px-2 py-1 text-xs shadow-none hover:border-neutral-300'
							onClick={() => navigate("/dashboard/profile")}
						>
							<div className='flex items-center justify-center gap-2'>
								<ChevronLeft size={8} />
								<span>Back</span>
							</div>
						</RippleButton>
						<h1 className='text-xl font-semibold'>Update your profile</h1>
					</header>
					<main className='p-4'>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
								<div className='flex gap-4'>
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

								{/* Old Password field */}
								<FormField
									control={form.control}
									name='oldPassword'
									render={({ field }) => (
										<FormItem className='flex flex-col items-start justify-center flex-1'>
											<FormLabel>Current Password (Leave blank if you don't want to change)</FormLabel>
											<FormControl>
												<div className='relative flex w-full gap-1'>
													<Input type={showOldPassword ? "text" : "password"} {...field} />
													<RippleButton
														className='active:scale-95 transition-all flex w-8 items-center justify-center'
														onClick={e => {
															e.preventDefault();
															setShowOldPassword(!showOldPassword);
														}}
													>
														{showOldPassword ? <Eye size={16} /> : <EyeOff size={16} />}
													</RippleButton>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* New Password field */}
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem className='flex flex-col items-start justify-center flex-1'>
											<FormLabel>New Password</FormLabel>
											<FormControl>
												<div className='relative flex w-full gap-1'>
													<Input type={showNewPassword ? "text" : "password"} {...field} />
													<RippleButton
														className='active:scale-95 transition-all flex w-8 items-center justify-center'
														onClick={e => {
															e.preventDefault();
															setShowNewPassword(!showNewPassword);
														}}
													>
														{showNewPassword ? <Eye size={16} /> : <EyeOff size={16} />}
													</RippleButton>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Avatar field */}
								<FormField
									control={form.control}
									name='avatar'
									render={({ field: { onChange, value, ...field } }) => (
										<FormItem>
											<FormLabel>Avatar</FormLabel>
											<FormControl>
												<div className='flex flex-col gap-4'>
													<Label
														htmlFor='avatar'
														className={cn(
															"flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed",
															"hover:border-neutral-400 hover:bg-neutral-100"
														)}
													>
														{imagePreview ? (
															<img
																src={imagePreview}
																alt='Preview'
																className='h-full w-full rounded-lg object-cover'
															/>
														) : (
															<div className='flex flex-col items-center justify-center text-neutral-500'>
																<ImageIcon className='h-8 w-8' />
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

								<RippleButton
									className='active:scale-[0.98] transition-all w-full hover:bg-indigo-500'
									type='submit'
								>
									{isUpdating ? <LoaderCircle className='animate-spin' /> : "Update Profile"}
								</RippleButton>
							</form>
						</Form>
					</main>
				</div>
			)}
		</m.div>
	);
}

export default EditProfile;
