import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { UserRow } from "./columns";
import { UserRole } from "@/types/auth";

interface DataTableProps<TData extends UserRow, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends UserRow, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const { user } = useAuth();
  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility: {
        role: false,
        action: hasActionPermission(user?.role_id ?? 1),
        phone: hasActionPermission(user?.role_id ?? 1),
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  function hasActionPermission(userRole: UserRole) {
    if (userRole === 1) return true;
    if (userRole < data[0].role) return true;

    return false;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
