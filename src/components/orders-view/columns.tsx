import { ColumnDef } from "@tanstack/react-table";
import { Check, Clipboard, LoaderCircle, Pen } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { RippleButton } from "../ui/ripple-button/ripple-button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import axios from "axios";

const statusSchema = z.object({
	status: z.enum([
		"pending",
		"processing",
		"shipped",
		"delivered",
		"cancelled",
	]),
});

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
			const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(
				null
			);

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
						<div>
							{copied ? (
								<Check size={20} />
							) : (
								<Clipboard size={20} />
							)}
						</div>
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
						}[status] as
							| "default"
							| "secondary"
							| "destructive"
							| "outline"
							| "warning"
							| "success"
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
	{
		accessorKey: "action",
		header: "Action",
		enableSorting: false,
		enableHiding: true,
		cell: function Cell({ row, table }) {
			const onDataChange = (table.options.meta as any)?.onDataChange;
			const [isLoading, setIsLoading] = useState(false);
			const [showEditDialog, setShowEditDialog] = useState(false);
			const currentStatus = row.getValue("status");

			const form = useForm<z.infer<typeof statusSchema>>({
				resolver: zodResolver(statusSchema),
				defaultValues: {
					status: currentStatus as z.infer<
						typeof statusSchema
					>["status"],
				},
			});

			const onSubmit = async (values: z.infer<typeof statusSchema>) => {
				setIsLoading(true);
				try {
					const orderId = row.getValue("id");
					const quantity = row.getValue("quantity");
					const price = row.getValue("price");

					// Make the API request using axios
					await axios({
						method: "PUT",
						url: `/api/orders/${orderId}`,
						data: {
							status: values.status,
							quantity,
							price,
						},
						headers: {
							"Content-Type": "application/json",
						},
					});

					await onDataChange();
				} catch (error) {
					console.error("Error updating order:", error);
				} finally {
					setIsLoading(false);
					setShowEditDialog(false);
				}
			};

			return (
				<div>
					<Dialog
						open={showEditDialog}
						onOpenChange={setShowEditDialog}
					>
						<DialogTrigger asChild>
							<RippleButton
								variant='secondary'
								size='sm'
								className='active:scale-95 transition-all h-auto border border-slate-200 px-2 py-1.5 dark:border-slate-700'
							>
								<div>
									<Pen size={20} />
								</div>
							</RippleButton>
						</DialogTrigger>
						<DialogContent showClose={false} className='gap-8'>
							<DialogHeader>
								<DialogTitle>Edit Order</DialogTitle>
								<VisuallyHidden>
									<DialogDescription>
										Edit status of the order.
									</DialogDescription>
								</VisuallyHidden>
							</DialogHeader>

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className='space-y-4'
								>
									<FormField
										control={form.control}
										name='status'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Status</FormLabel>
												<FormControl>
													<Select
														onValueChange={
															field.onChange
														}
														defaultValue={
															field.value
														}
													>
														<SelectTrigger>
															<SelectValue placeholder='Select status' />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='pending'>
																Pending
															</SelectItem>
															<SelectItem value='processing'>
																Processing
															</SelectItem>
															<SelectItem value='shipped'>
																Shipped
															</SelectItem>
															<SelectItem value='delivered'>
																Delivered
															</SelectItem>
															<SelectItem value='cancelled'>
																Cancelled
															</SelectItem>
														</SelectContent>
													</Select>
												</FormControl>
											</FormItem>
										)}
									/>
									<DialogFooter>
										<RippleButton
											size='sm'
											type='submit'
											className='active:scale-95 transition-all'
											disabled={isLoading}
										>
											{isLoading ? (
												<LoaderCircle className='animate-spin' />
											) : (
												"Save changes"
											)}
										</RippleButton>
										<DialogClose asChild>
											<RippleButton
												className='active:scale-95 transition-all'
												size='sm'
												variant='outline'
											>
												Close
											</RippleButton>
										</DialogClose>
									</DialogFooter>
								</form>
							</Form>
						</DialogContent>
					</Dialog>
				</div>
			);
		},
		size: 60,
	},
];
