import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { RippleButton } from "../ui/ripple-button/ripple-button";
import { Check, Clipboard, Pen } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
	id: string;
	avatar: string;
	name: string;
	email: string;
	phone: string;
};

export const columns: ColumnDef<User>[] = [
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
						className='h-auto border border-slate-200 px-2 py-1.5 dark:border-slate-700'
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
					<Avatar>
						<AvatarImage src={avatar} />
						<AvatarFallback className='bg-slate-200'>
							{(row.getValue("name") as string).split(" ")[0].charAt(0) +
								(row.getValue("name") as string).split(" ")[1].charAt(0)}
						</AvatarFallback>
					</Avatar>
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
		accessorKey: "action",
		header: "Actions",
		enableSorting: false,
		size: 100,
		cell: function Cell({ row }) {
			const id: string = row.getValue("id");
			return (
				<div className='flex items-center gap-2'>
					<Link to={`/dashboard/admin/edit/${id}`}>
						<RippleButton
							variant={"secondary"}
							size={"sm"}
							className='h-auto border border-slate-200 px-2 py-1.5 dark:border-slate-700'
						>
							<div className='flex items-center gap-2'>
								<Pen size={20} />
								<span>Edit</span>
							</div>
						</RippleButton>
					</Link>
				</div>
			);
		},
	},
];
