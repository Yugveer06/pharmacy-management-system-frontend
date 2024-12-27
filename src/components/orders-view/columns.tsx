import { ColumnDef } from "@tanstack/react-table";
import { Check, Clipboard } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { RippleButton } from "../ui/ripple-button/ripple-button";

export type OrderRow = {
	id: string;
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	quantity: number;
	price: number;
};

export const columns: ColumnDef<OrderRow>[] = [
	{
		accessorKey: "id",
		header: "Order ID",
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
				<div className='flex items-center gap-2'>
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
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status: string = row.getValue("status");
			return (
				<Badge
					variant={
						{
							delivered: "success",
							pending: "warning",
							cancelled: "destructive",
							shipped: "primary",
							processing: "secondary",
						}[status] as "default" | "secondary" | "destructive" | "outline" | "warning" | "success"
					}
				>
					{status}
				</Badge>
			);
		},
	},
	{
		accessorKey: "quantity",
		header: "Quatity",
	},
	{
		accessorKey: "price",
		header: "price",
	},
];
