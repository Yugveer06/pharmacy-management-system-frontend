import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	Table as TableInstance,
	useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, ArrowUpDown, CalendarIcon, LoaderCircle, X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RippleButton } from "../ui/ripple-button/ripple-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { DrugRow } from "./columns";

interface DataTableProps<TData extends DrugRow, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onDataChange: () => Promise<void>;
	isLoading: boolean;
}

const PaginationSection = <TData extends DrugRow>({
	table,
	deleteFilteredSelectedRows,
	deleting,
}: {
	table: TableInstance<TData>;
	deleteFilteredSelectedRows: () => Promise<void>;
	deleting: boolean;
}) => {
	return (
		<div className='flex flex-col gap-4 px-2 py-2 sm:flex-row sm:items-center sm:justify-between'>
			<div className='flex items-center gap-2 order-2 whitespace-nowrap text-sm text-muted-foreground sm:order-1'>
				{table.getFilteredRowModel().rows.length === table.getCoreRowModel().rows.length ? (
					<>Total Records: {table.getCoreRowModel().rows.length} </>
				) : (
					<>
						Filtered Records: {table.getFilteredRowModel().rows.length} / {table.getCoreRowModel().rows.length} total
					</>
				)}
				{table.getFilteredSelectedRowModel().rows.length > 0 && ` (${table.getFilteredSelectedRowModel().rows.length} selected)`}
				{table.getFilteredSelectedRowModel().rows.length > 0 && (
					<RippleButton onClick={deleteFilteredSelectedRows} size='sm' variant='destructive' className='active:scale-95 transition-all' disabled={deleting}>
						<div className='flex gap-2 items-center'>
							{deleting ? <LoaderCircle className='animate-spin' /> : <span>Delete {table.getFilteredSelectedRowModel().rows.length} Rows</span>}
						</div>
					</RippleButton>
				)}
			</div>

			<div className='order-1 flex flex-col items-center sm:items-end gap-2 sm:order-2 lg:flex-row sm:gap-2'>
				<div className='flex items-center gap-2 whitespace-nowrap'>
					<span className='text-sm font-medium'>Rows per page</span>
					<Select
						value={String(table.getState().pagination.pageSize)}
						onValueChange={value => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className='bg-white h-8 w-[70px]'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[10, 15, 25, 50, 100].map(pageSize => (
								<SelectItem key={pageSize} value={String(pageSize)}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='flex gap-4 sm:gap-6 lg:gap-8'>
					<div className='flex items-center justify-center text-sm font-medium'>
						Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
					</div>
					<div className='flex items-center gap-2'>
						<RippleButton variant='outline' size='icon' className='hidden h-8 w-8 lg:flex' onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
							<span className='sr-only'>Go to first page</span>
							{"<<"}
						</RippleButton>
						<RippleButton variant='outline' size='icon' className='h-8 w-8' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
							<span className='sr-only'>Go to previous page</span>
							{"<"}
						</RippleButton>
						<RippleButton variant='outline' size='icon' className='h-8 w-8' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
							<span className='sr-only'>Go to next page</span>
							{">"}
						</RippleButton>
						<RippleButton variant='outline' size='icon' className='hidden h-8 w-8 lg:flex' onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
							<span className='sr-only'>Go to last page</span>
							{">>"}
						</RippleButton>
					</div>
				</div>
			</div>
		</div>
	);
};

const drugSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	price: z.number().min(0, "Price must be positive"),
	quantity: z.number().int().min(0, "Quantity must be positive"),
	mfg_date: z.date(),
	exp_date: z.date(),
});
type DrugFormValues = z.infer<typeof drugSchema>;

const AddDrugDialog = ({ isOpen, onClose, onDataChange }: { isOpen: boolean; onClose: () => void; onDataChange: () => Promise<void> }) => {
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<DrugFormValues>({
		resolver: zodResolver(drugSchema),
		defaultValues: {
			name: "",
			description: "",
			price: 0,
			quantity: 0,
		},
	});

	// Reset form when dialog closes
	React.useEffect(() => {
		if (!isOpen) {
			form.reset();
		}
	}, [isOpen, form]);

	const addDrug = async (data: DrugFormValues) => {
		const response = await axios.post(`/api/drugs`, data, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response.data;
	};

	const onSubmit = async (data: DrugFormValues) => {
		try {
			setIsLoading(true);
			await addDrug(data);
			await onDataChange(); // Refresh data after adding
			onClose();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Add Drug</DialogTitle>
					<DialogDescription>Enter the details of the new drug below.</DialogDescription>
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

const DataTable = React.memo(<TData extends DrugRow, TValue>({ columns, data, onDataChange, isLoading }: DataTableProps<TData, TValue>) => {
	const [sorting, setSorting] = React.useState<SortingState>([{ id: "name", desc: false }]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [searchFilter, setSearchFilter] = React.useState("");
	const [addDrugDialogOpen, setAddDrugDialogOpen] = React.useState(false);
	const [deleting, setDeleting] = useState(false);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: updater => {
			const nextState = typeof updater === "function" ? updater(sorting) : updater;

			if (nextState.length === 0) {
				nextState[0] = { id: sorting[0].id, desc: false };
			}
			setSorting(nextState);
		},
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: (row, _columnId, filterValue: string) => {
			const searchValue = filterValue.toLowerCase();
			const id = String(row.getValue("id")).toLowerCase();
			const name = String(row.getValue("name")).toLowerCase();
			const description = String(row.getValue("description")).toLowerCase();

			return id.includes(searchValue) || name.includes(searchValue) || description.includes(searchValue);
		},
		state: {
			sorting,
			columnFilters,
			globalFilter: searchFilter,
			columnVisibility: {
				manufacturer: false,
				description: false,
			},
		},
		onGlobalFilterChange: setSearchFilter,
	});

	const deleteFilteredSelectedRows = async () => {
		try {
			setDeleting(true);
			const selectedRowIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);
			const deletePromises = selectedRowIds.map(id =>
				axios.delete(`/api/drugs/${id}`, {
					headers: {
						"Content-Type": "application/json",
					},
				})
			);

			await Promise.all(deletePromises);
			await onDataChange();
		} catch (error) {
			console.error("Error deleting rows:", error);
		} finally {
			setDeleting(false);
			table.resetRowSelection();
		}
	};

	return (
		<div className='space-y-4'>
			<div className='flex flex-col items-start gap-2'>
				<RippleButton onClick={() => setAddDrugDialogOpen(true)} className='active:scale-95 transition-all'>
					Add Drug
				</RippleButton>
				<AddDrugDialog isOpen={addDrugDialogOpen} onClose={() => setAddDrugDialogOpen(false)} onDataChange={onDataChange} />
				<div className='relative w-full'>
					<Input
						placeholder='Search by id or name or description'
						value={searchFilter}
						maxLength={48}
						onChange={event => {
							const value = event.target.value;
							setSearchFilter(value);
						}}
						className='h-8 w-full pr-8 shadow-none focus-visible:ring-slate-200 dark:focus-visible:ring-slate-700'
					/>
					{searchFilter && (
						<button
							onClick={() => setSearchFilter("")}
							className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
						>
							<X size={16} />
						</button>
					)}
				</div>
			</div>
			<div className='rounded-md border'>
				<PaginationSection table={table} deleteFilteredSelectedRows={deleteFilteredSelectedRows} deleting={deleting} />
				<div className='relative overflow-x-auto border-t'>
					<Table>
						<TableHeader className='sticky top-0'>
							{table.getHeaderGroups().map(headerGroup => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map(header => (
										<TableHead
											key={header.id}
											className={cn("whitespace-nowrap", header.column.getCanSort() && "cursor-pointer select-none")}
											onClick={header.column.getToggleSortingHandler()}
										>
											<div className='flex items-center gap-2'>
												{flexRender(header.column.columnDef.header, header.getContext())}
												{header.column.getCanSort() &&
													(header.column.getIsSorted() ? (
														header.column.getIsSorted() === "asc" ? (
															<ArrowUp className='h-4 w-4' />
														) : (
															<ArrowDown className='h-4 w-4' />
														)
													) : (
														<ArrowUpDown className='h-4 w-4 opacity-50' />
													))}
											</div>
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={columns.length} className='h-24'>
										<div className='w-full flex justify-center items-center'>
											<LoaderCircle className='animate-spin' />
										</div>
									</TableCell>
								</TableRow>
							) : table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
										{row.getVisibleCells().map(cell => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className='h-24 text-center'>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<PaginationSection table={table} deleteFilteredSelectedRows={deleteFilteredSelectedRows} deleting={deleting} />
			</div>
		</div>
	);
});

DataTable.displayName = "DataTable";

export { DataTable };
