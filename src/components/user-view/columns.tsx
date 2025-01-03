import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { RippleButton } from "../ui/ripple-button/ripple-button";
import { Check, Clipboard, Pen, Trash } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import axios from "axios";
import { ImageViewer } from "../ui/image-viewer";

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

function handleUserDelete(id: string) {
	axios
		.delete(`/api/auth/delete-user/${id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
		.then(response => {
			console.log("User deleted successfully", response);
			window.location.reload();
		})
		.catch(error => {
			const message = error.response?.data?.message || "Failed to delete user";
			console.error(message);
		});
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
						<ImageViewer.Content title='Profile Picture' description={row.getValue("name")}></ImageViewer.Content>
					</ImageViewer>
				</div>
			);
		},
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "phone",
		header: "Phone",
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

			const roleMap = ["admin", "manager", "pharmacist", "salesman"];

			return (
				<div className='flex lg:flex-row flex-col items-center gap-2'>
					<RippleButton variant={"secondary"} size={"sm"} className='w-full lg:w-fit active:scale-95 transition-all h-auto border border-slate-200 dark:border-slate-700 p-0'>
						<Link to={`/dashboard/${roleMap[role - 1]}/update/${id}`} className='flex items-center justify-center w-full px-2 py-1.5' draggable='false'>
							<Pen size={20} />
						</Link>
					</RippleButton>
					<RippleButton
						variant={"destructive"}
						size={"sm"}
						onClick={() => handleUserDelete(id)}
						className='w-full lg:w-fit active:scale-95 transition-all h-auto border border-slate-200 px-2 py-1.5 dark:border-slate-700'
					>
						<Trash size={20} />
					</RippleButton>
				</div>
			);
		},
	},
];
