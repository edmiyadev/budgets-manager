import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/app/categories/data-table"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { columns } from "@/app/categories/columns"
import { Category } from "@/types/category"
import { CategoryModal } from "@/app/categories/category-modal"


const data: Category[] = [
    {
        id: "m5gr84i9",
        name: "Food & Dining",
        amount: 316,
        type: "expense",
    },
    {
        id: "3u1reuv4",
        name: "Salary",
        amount: 242,
        type: "income",
    },
    {
        id: "derv1ws0",
        name: "Transportation",
        amount: 837,
        type: "expense",
    },
    {
        id: "5kma53ae",
        name: "Freelance",
        amount: 874,
        type: "income",
    },
    {
        id: "bhqecj4p",
        name: "Entertainment",
        amount: 721,
        type: "expense",
    },
]

export default function CategoriesPage() {

    // cargar los datos asíncronos
    // const data = await getData();

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title="Categories" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <div className="flex flex-col items-end">
                                    <CategoryModal />
                                </div>
                                <DataTable columns={columns} data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
