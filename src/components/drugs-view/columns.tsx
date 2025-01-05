import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarIcon, Check, Clipboard, Eye, LoaderCircle, Pen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RippleButton } from "../ui/ripple-button/ripple-button";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

const drugSchema = z.object({
	name: z.string().min(1, "Name is required"),
	manufacturer: z.string().min(1, "Manufacturer is required"),
	description: z.string().min(1, "Description is required"),
	price: z.number().min(0, "Price must be positive"),
	quantity: z.number().int().min(0, "Quantity must be positive"),
	mfg_date: z.date(),
	exp_date: z.date(),
});

type DrugFormValues = z.infer<typeof drugSchema>;

const EditDrugDialog = ({ drug, isOpen, onClose, onDataChange }: { drug: DrugRow; isOpen: boolean; onClose: () => void; onDataChange: () => Promise<void> }) => {
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<DrugFormValues>({
		resolver: zodResolver(drugSchema),
		defaultValues: {
			name: drug.name,
			manufacturer: drug.manufacturer,
			description: drug.description,
			price: drug.price,
			quantity: drug.quantity,
			mfg_date: new Date(drug.mfg_date),
			exp_date: new Date(drug.exp_date),
		},
	});

	const updateDrug = async (id: string, data: DrugFormValues) => {
		const response = await fetch(`/api/drugs/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error("Failed to update drug");
		}

		return response.json();
	};

	const onSubmit = async (data: DrugFormValues) => {
		try {
			setIsLoading(true);
			await updateDrug(drug.id, data);
			await onDataChange(); // Refresh data after editing
			onClose();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Edit Drug</DialogTitle>
					<DialogDescription>Edit the details of the drug below.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='manufacturer'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Manufacturer</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea {...field} className='max-h-48' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='price'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input type='number' {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='quantity'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Quantity</FormLabel>
									<FormControl>
										<Input type='number' {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='mfg_date'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel>Manufacturing Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
													{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
													<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className='w-auto p-0' align='start'>
											<Calendar mode='single' selected={field.value} onSelect={field.onChange} disabled={date => date > new Date() || date < new Date("1900-01-01")} />
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='exp_date'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel>Expiry Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
													{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
													<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className='w-auto p-0' align='start'>
											<Calendar mode='single' selected={field.value} onSelect={field.onChange} disabled={date => date < new Date()} />
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<RippleButton size='sm' type='submit' className='active:scale-95 transition-all' disabled={isLoading}>
								{isLoading ? <LoaderCircle className='animate-spin' /> : "Save changes"}
							</RippleButton>
							<RippleButton className='active:scale-95 transition-all' size='sm' type='button' variant='outline' onClick={onClose} disabled={isLoading}>
								Cancel
							</RippleButton>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export type DrugRow = {
	id: string;
	name: string;
	manufacturer: string;
	description: string;
	price: number;
	quantity: number;
	mfg_date: Date;
	exp_date: Date;
};

export const columns: ColumnDef<DrugRow>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label='Select row' />,
		enableSorting: false,
		enableHiding: false,
		size: 40,
	},
	{
		accessorKey: "view",
		header: "View",
		enableSorting: false,
		cell: function Cell({ row, table }) {
			// Access onDataChange through table.options
			const onDataChange = (table.options as any).onDataChange;
			const [showEditDialog, setShowEditDialog] = useState(false);
			const [showViewDialog, setShowViewDialog] = useState(false);

			const handleEditClick = () => {
				setShowViewDialog(false);
				setShowEditDialog(true);
			};

			return (
				<div>
					<Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
						<DialogTrigger asChild>
							<RippleButton variant='secondary' size='sm' className='active:scale-95 transition-all h-auto border border-slate-200 px-2 py-1.5 dark:border-slate-700'>
								<div>
									<Eye size={20} />
								</div>
							</RippleButton>
						</DialogTrigger>
						<DialogContent showClose={false} className='gap-8'>
							<DialogHeader>
								<DialogTitle>Drug Details</DialogTitle>
								<VisuallyHidden>
									<DialogDescription>View details of the drug.</DialogDescription>
								</VisuallyHidden>
							</DialogHeader>
							<div className='flex flex-col gap-4'>
								<div className='flex flex-col gap-0.5'>
									<span className='font-medium'>ID</span>
									<span className='text-sm text-neutral-600'>{row.getValue("id")}</span>
								</div>
								<div className='flex flex-col gap-0.5'>
									<span className='font-medium'>Name</span>
									<span className='text-sm text-neutral-600'>{row.getValue("name")}</span>
								</div>
								<div className='flex flex-col gap-0.5'>
									<span className='font-medium'>Manufacturer</span>
									<span className='text-sm text-neutral-600'>{row.getValue("manufacturer")}</span>
								</div>
								<div className='flex flex-col gap-0.5'>
									<span className='font-medium'>Description</span>
									<span className='text-sm text-neutral-600'>{row.getValue("description")}</span>
								</div>
								<div className='flex flex-col gap-0.5'>
									<span className='font-medium'>Price</span>
									<span className='text-sm text-neutral-600'>{row.getValue("price")}</span>
								</div>
								<div className='flex flex-col gap-0.5'>
									<span className='font-medium'>Quantity</span>
									<span className='text-sm text-neutral-600'>{row.getValue("quantity")}</span>
								</div>
								<div className='flex flex-col gap-0.5'>
									<span className='font-medium'>Manufacturing Date</span>
									<span className='text-sm text-neutral-600'>{row.getValue("mfg_date")}</span>
								</div>
								<div className='flex flex-col gap-0.5'>
									<span className='font-medium'>Expiry Date</span>
									<span className='text-sm text-neutral-600'>{row.getValue("exp_date")}</span>
								</div>
							</div>
							<DialogFooter>
								<RippleButton className='active:scale-95 transition-all hover:bg-indigo-600' size='sm' onClick={handleEditClick}>
									<div className='flex gap-2'>
										<Pen size={20} />
										<span>Edit Drug</span>
									</div>
								</RippleButton>
								<DialogClose asChild>
									<RippleButton className='active:scale-95 transition-all' size='sm' variant='outline'>
										Close
									</RippleButton>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<EditDrugDialog drug={row.original} isOpen={showEditDialog} onClose={() => setShowEditDialog(false)} onDataChange={onDataChange} />
				</div>
			);
		},
		size: 60,
	},
	{
		accessorKey: "id",
		header: "ID",
		enableColumnFilter: true,
		enableSorting: false,
		filterFn: "includesString",
		size: 100,
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
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			return (
				<div className='truncate max-w-[200px]' title={row.getValue("name")}>
					{row.getValue("name")}
				</div>
			);
		},
		size: 150,
	},
	{
		accessorKey: "manufacturer",
		header: "Manufacturer",
		cell: ({ row }) => {
			return (
				<div className='truncate max-w-[200px]' title={row.getValue("manufacturer")}>
					{row.getValue("manufacturer")}
				</div>
			);
		},
		size: 150,
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => {
			return (
				<div className='truncate max-w-[200px]' title={row.getValue("description")}>
					{row.getValue("description")}
				</div>
			);
		},
		size: 200,
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({ row }) => {
			return <div>${row.getValue("price")}</div>;
		},
		size: 100,
	},
	{
		accessorKey: "quantity",
		header: "Quantity",
		size: 100,
	},
	{
		accessorKey: "mfg_date",
		header: "Manufacturing Date",
		cell: ({ row }) => {
			return new Date(row.getValue("mfg_date")).toLocaleDateString();
		},
		size: 150,
	},
	{
		accessorKey: "exp_date",
		header: "Expiry Date",
		cell: ({ row }) => {
			return new Date(row.getValue("exp_date")).toLocaleDateString();
		},
		size: 150,
	},
];
