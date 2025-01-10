import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Check, Clipboard, LoaderCircle, Pen, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
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
} from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ImageViewer } from "../ui/image-viewer";
import { RippleButton } from "../ui/ripple-button/ripple-button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserRow = {
	id: string;
	avatar: string;
	name: string;
	email: string;
	phone: string;
	role: number;
};

async function handleUserDelete(id: string) {
	try {
		const response = await axios.delete(`/api/auth/delete-user/${id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		console.log("User deleted successfully", response);
		window.location.reload();
	} catch (error) {
		const message = axios.isAxiosError(error) ? error.response?.data?.message : "Failed to delete user";
		throw new Error(message);
	}
}

export const columns: ColumnDef<UserRow>[] = [
	{
		accessorKey: "id",
		header: "ID",
		enableColumnFilter: true,
		enableSorting: false,
		filterFn: "includesString",
		size: 120,
		cell: function Cell({ row }) {
			const id: string = row.getValue("id");
			const [copied, setCopied] = useState(false);
			const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

			const handleCopy = () => {
				void navigator.clipboard.writeText(id);
				setCopied(true);
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				const newTimeoutId = setTimeout(() => setCopied(false), 2000);
				setTimeoutId(newTimeoutId);
			};

			return (
				<div className='flex items-center gap-2 whitespace-nowrap'>
					<RippleButton
						tooltip={id}
						variant='secondary'
						size='sm'
						className='active:scale-95 transition-all h-auto border border-slate-200 px-2 py-1.5 dark:border-slate-700'
						onClick={handleCopy}
					>
						<div>{copied ? <Check size={20} /> : <Clipboard size={20} />}</div>
					</RippleButton>
				</div>
			);
		},
	},
	{
		accessorKey: "avatar",
		header: "Avatar",
		cell: function Cell({ row }) {
			const avatar: string = row.getValue("avatar");
			return (
				<div className='flex items-center gap-2'>
					<ImageViewer imageSrc={avatar}>
						<ImageViewer.Trigger>
							<Avatar>
								<AvatarImage src={avatar} alt={row.getValue("name")} />
								<AvatarFallback className='bg-neutral-100 border border-neutral-300'>
									{(row.getValue("name") as string).split(" ")[0].split("")[0]}
									{(row.getValue("name") as string).split(" ")[1].split("")[0]}
								</AvatarFallback>
							</Avatar>
						</ImageViewer.Trigger>
						<ImageViewer.Overlay className='backdrop-blur-[36px] bg-neutral-950/5' />
						<ImageViewer.Content title='Profile Picture' description={row.getValue("name")}></ImageViewer.Content>
					</ImageViewer>
				</div>
			);
		},
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: function Cell({ row }) {
			return <div className='text-left'>{row.getValue("name") as string}</div>;
		},
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: function Cell({ row }) {
			return <div className='text-left'>{row.getValue("email") as string}</div>;
		},
	},
	{
		accessorKey: "phone",
		header: "Phone",
		cell: function Cell({ row }) {
			return <div className='text-left'>{row.getValue("phone") as string}</div>;
		},
	},
	{
		accessorKey: "role",
		header: "Role",
	},
	{
		accessorKey: "action",
		header: "Actions",
		enableSorting: false,
		size: 100,
		enableHiding: true,
		cell: function Cell({ row }) {
			const id: string = row.getValue("id");
			const role: number = row.getValue("role");
			const [deleteLoader, setDeleteLoader] = useState(false);
			const roleMap = ["admin", "manager", "pharmacist", "salesman"];

			async function onDelete() {
				try {
					setDeleteLoader(true);
					await handleUserDelete(id);
				} catch (error) {
					setDeleteLoader(false);
					console.error(error);
				}
			}

			return (
				<div className='flex lg:flex-row flex-col items-center gap-2'>
					<RippleButton variant={"secondary"} size={"sm"} className='w-full lg:w-fit active:scale-95 transition-all h-auto border border-slate-200 dark:border-slate-700 p-0'>
						<Link to={`/dashboard/${roleMap[role - 1]}/update/${id}`} className='flex items-center justify-center w-full px-2 py-1.5' draggable='false'>
							<Pen size={20} />
						</Link>
					</RippleButton>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<RippleButton
								variant={"destructive"}
								size={"sm"}
								className='w-full lg:w-fit active:scale-95 transition-all h-auto border border-slate-200 px-2 py-1.5 dark:border-slate-700'
							>
								<Trash size={20} />
							</RippleButton>
						</AlertDialogTrigger>
						<AlertDialogContent className='p-0 flex w-[96vw] max-w-[512px] flex-col rounded-lg border border-neutral-200 bg-neutral-50 gap-0'>
							<AlertDialogHeader className='flex gap-4 rounded-t-lg bg-neutral-200/50 p-4'>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							</AlertDialogHeader>
							<AlertDialogDescription className='p-4'>
								This action cannot be undone. This will permanently delete the user account and remove their data from our servers.
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
										onClick={onDelete}
										disabled={deleteLoader}
									>
										{deleteLoader ? <LoaderCircle className='animate-spin' /> : "Delete User"}
									</RippleButton>
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			);
		},
	},
];
