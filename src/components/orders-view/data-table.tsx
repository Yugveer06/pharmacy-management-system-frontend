import {
	Table as TableInstance,
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	SortingState,
	getSortedRowModel,
	ColumnFiltersState,
	getFilteredRowModel,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { RippleButton } from "../ui/ripple-button/ripple-button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { OrderRow } from "./columns";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown, LoaderCircle, X } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

interface DataTableProps<TData extends OrderRow, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onDataChange: () => Promise<void>;
	isLoading: boolean;
}

const PaginationSection = <TData extends OrderRow>({
	table,
}: {
	table: TableInstance<TData>;
}) => {
	return (
		<div className='flex flex-col gap-4 px-2 py-2 sm:flex-row sm:items-center sm:justify-between'>
			<div className='order-2 whitespace-nowrap text-sm text-muted-foreground sm:order-1'>
				{table.getFilteredRowModel().rows.length ===
				table.getCoreRowModel().rows.length ? (
					<>Total Records: {table.getCoreRowModel().rows.length}</>
				) : (
					<>
						Filtered Records:{" "}
						{table.getFilteredRowModel().rows.length} /{" "}
						{table.getCoreRowModel().rows.length} total
					</>
				)}
			</div>
			<div className='order-1 flex flex-col items-center gap-4 sm:order-2 lg:flex-row sm:gap-6'>
				<div className='flex items-center gap-2 whitespace-nowrap'>
					<p className='text-sm font-medium'>Rows per page</p>
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
								<SelectItem
									key={pageSize}
									value={String(pageSize)}
								>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='flex gap-4 sm:gap-6 lg:gap-8'>
					<div className='flex min-w-[100px] items-center justify-center text-sm font-medium'>
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</div>
					<div className='flex items-center gap-2'>
						<RippleButton
							variant='outline'
							size='icon'
							className='hidden h-8 w-8 lg:flex'
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className='sr-only'>Go to first page</span>
							{"<<"}
						</RippleButton>
						<RippleButton
							variant='outline'
							size='icon'
							className='h-8 w-8'
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className='sr-only'>Go to previous page</span>
							{"<"}
						</RippleButton>
						<RippleButton
							variant='outline'
							size='icon'
							className='h-8 w-8'
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className='sr-only'>Go to next page</span>
							{">"}
						</RippleButton>
						<RippleButton
							variant='outline'
							size='icon'
							className='hidden h-8 w-8 lg:flex'
							onClick={() =>
								table.setPageIndex(table.getPageCount() - 1)
							}
							disabled={!table.getCanNextPage()}
						>
							<span className='sr-only'>Go to last page</span>
							{">>"}
						</RippleButton>
					</div>
				</div>
			</div>
		</div>
	);
};

const DataTable = React.memo(
	<TData extends OrderRow, TValue>({
		columns,
		data,
		onDataChange,
		isLoading,
	}: DataTableProps<TData, TValue>) => {
		const [sorting, setSorting] = React.useState<SortingState>([]);
		const [columnFilters, setColumnFilters] =
			React.useState<ColumnFiltersState>([]);
		const [searchFilter, setSearchFilter] = React.useState("");
		const { user } = useAuth();
		const table = useReactTable({
			data,
			columns,
			getCoreRowModel: getCoreRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			onSortingChange: updater => {
				const nextState =
					typeof updater === "function" ? updater(sorting) : updater;
				// If trying to remove sorting (third click), toggle back to descending
				setSorting(nextState);
			},
			getSortedRowModel: getSortedRowModel(),
			onColumnFiltersChange: setColumnFilters,
			getFilteredRowModel: getFilteredRowModel(),
			globalFilterFn: (row, _columnId, filterValue: string) => {
				const searchValue = filterValue.toLowerCase();
				const id = String(row.getValue("id")).toLowerCase();
				const name = String(row.getValue("name")).toLowerCase();
				const description = String(
					row.getValue("description")
				).toLowerCase();

				return (
					id.includes(searchValue) ||
					name.includes(searchValue) ||
					description.includes(searchValue)
				);
			},
			state: {
				sorting,
				columnFilters,
				globalFilter: searchFilter,
				columnVisibility: {
					action: hasActionPermission(user?.role_id ?? 1),
				},
			},
			onGlobalFilterChange: setSearchFilter,
			meta: {
				onDataChange,
			},
		});

		function hasActionPermission(userRole: UserRole) {
			if (userRole === 1 || userRole === 2) return true;

			return false;
		}

		return (
			<div className='space-y-4'>
				<div className='relative w-full'>
					<Input
						placeholder='Search by id'
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
				<div className='rounded-md border'>
					<PaginationSection table={table} />
					<div className='[&>*]:border border-red-1 border-t'>
						<div className='overflow-x-auto whitespace-nowrap'>
							<Table>
								<TableHeader>
									{table
										.getHeaderGroups()
										.map(headerGroup => (
											<TableRow key={headerGroup.id}>
												{headerGroup.headers.map(
													header => (
														<TableHead
															key={header.id}
															className={cn(
																"whitespace-nowrap",
																header.column.getCanSort() &&
																	"cursor-pointer select-none"
															)}
															onClick={header.column.getToggleSortingHandler()}
														>
															<div className='flex items-center gap-2'>
																{flexRender(
																	header
																		.column
																		.columnDef
																		.header,
																	header.getContext()
																)}
																{header.column.getCanSort() &&
																	(header.column.getIsSorted() ? (
																		header.column.getIsSorted() ===
																		"asc" ? (
																			<ArrowUp className='h-4 w-4' />
																		) : (
																			<ArrowDown className='h-4 w-4' />
																		)
																	) : (
																		<ArrowUpDown className='h-4 w-4 opacity-50' />
																	))}
															</div>
														</TableHead>
													)
												)}
											</TableRow>
										))}
								</TableHeader>
								<TableBody>
									{isLoading ? (
										<TableRow>
											<TableCell
												colSpan={columns.length}
												className='h-24'
											>
												<div className='w-full flex justify-center items-center'>
													<LoaderCircle className='animate-spin' />
												</div>
											</TableCell>
										</TableRow>
									) : table.getRowModel().rows?.length ? (
										table.getRowModel().rows.map(row => (
											<TableRow
												key={row.id}
												data-state={
													row.getIsSelected() &&
													"selected"
												}
											>
												{row
													.getVisibleCells()
													.map(cell => (
														<TableCell
															key={cell.id}
														>
															{flexRender(
																cell.column
																	.columnDef
																	.cell,
																cell.getContext()
															)}
														</TableCell>
													))}
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={columns.length}
												className='h-24 text-center'
											>
												No results.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
					<PaginationSection table={table} />
				</div>
			</div>
		);
	}
);

export { DataTable };
