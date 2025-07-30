"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit2Icon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Category } from "@/types/category"
import { CategoryModal } from "@/app/categories/category-modal"

export const columns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-DO", {
        style: "currency",
        currency: "DOP",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    enableHiding: true,
    cell: ({ row }) => {
      const category = row.original

      return (
        <div className="flex items-center justify-center gap-2">

          <CategoryModal variant="ghost" mode="edit" category={category}>
            <Edit2Icon className="text-primary" />
          </CategoryModal>

          <Button
            variant="ghost"
            onClick={() => {
              // TODO: Implement delete functionality
              console.log("Delete category:", category)
            }}
          >
            <Trash2Icon className="text-destructive" />
          </Button>
        </div>
      )
    },
  },
]
