import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {TooltipProvider} from "@/components/ui/tooltip";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@radix-ui/react-tooltip";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    fortable: any;
}

export function DataTable<TData, TValue>({columns, data, fortable,}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    console.log("fortable", fortable);

    return (
        <div className="rounded-md border">
            {/* Data Table */}
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    <TooltipProvider>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <Tooltip key={row.id}>
                                    <TooltipTrigger asChild>
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="hover:bg-gray-100">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TooltipTrigger>
                                    {/*<TooltipContent>*/}
                                    {/*  <div className="flex shadow-lg items-center justify-center w-[150px] h-[150px] bg-background">*/}
                                    {/*    <img*/}
                                    {/*      src={fortable[index].imageUrl}*/}
                                    {/*      alt={"image" + index}*/}
                                    {/*      width={145}*/}
                                    {/*      height={145}*/}
                                    {/*    />*/}
                                    {/*  </div>*/}
                                    {/*</TooltipContent>*/}
                                </Tooltip>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TooltipProvider>
                </TableBody>
            </Table>
        </div>
    );
}
