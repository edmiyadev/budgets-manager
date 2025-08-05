"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usePathname, useSearchParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/pagination"
import { getPaginatedCategories } from "@/actions/categories/categories-pagination"
import { Category } from "@/types/category"
import { useCallback, useEffect, useMemo, useState } from "react"

interface DataTableProps<TValue> {
  columns: ColumnDef<Category, TValue>[]
}

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;
const OPTIONS_PAGE_SIZE = [10, 20, 25, 30, 40, 50];

export function DataTable<TValue>({
  columns,
}: DataTableProps<TValue>) {

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get('page')) || DEFAULT_PAGE;
  const currentPageSize = Number(searchParams.get('take')) || DEFAULT_PAGE_SIZE;

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPage - 1,
    pageSize: currentPageSize,
  })

  const dataQuery = useQuery({
    queryKey: ['categories', currentPage, currentPageSize],
    queryFn: () => getPaginatedCategories({
      pageIndex: currentPage - 1,
      pageSize: currentPageSize
    }),
    placeholderData: keepPreviousData,
  })


  const redirectToValidPage = useCallback((pageIndex: number, pageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', (pageIndex + 1).toString());
    params.set('take', pageSize.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);


  const handlePaginationChange = useCallback((updater: any) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater; // pattern for state setters

    const params = new URLSearchParams(searchParams);
    params.set('page', (newPagination.pageIndex + 1).toString());
    params.set('take', newPagination.pageSize.toString());

    setPagination(newPagination);
    router.push(`${pathname}?${params.toString()}`);
  }, [pagination, searchParams, pathname, router]);


  const defaultData = useMemo(() => [], [])

  const table = useReactTable<Category>({
    data: dataQuery.data?.rows ?? defaultData,
    columns,
    pageCount: dataQuery.data?.pageCount ?? 0,
    rowCount: dataQuery.data?.rowCount ?? 0,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: handlePaginationChange, // use custom handler
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })


  useEffect(() => {
    if (currentPage < 1 || !OPTIONS_PAGE_SIZE.includes(currentPageSize)) {
      redirectToValidPage(0, 10);
    }

    setPagination({
      pageIndex: currentPage - 1,
      pageSize: currentPageSize,
    });
  }, [currentPage, currentPageSize, dataQuery.data?.pageCount]);


  useEffect(() => {
    if (dataQuery.data?.pageCount !== undefined &&
      dataQuery.data.pageCount > 0 &&
      currentPage > dataQuery.data.pageCount) {
      redirectToValidPage(0, currentPageSize);
    }
  }, [dataQuery.data?.pageCount, currentPage, currentPageSize, redirectToValidPage])


  return (
    <div className="flex items-center justify-between">
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter names..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-hidden rounded-md border">
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
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
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
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
