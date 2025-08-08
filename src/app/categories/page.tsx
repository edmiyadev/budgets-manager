import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/categories/data-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { columns } from "@/components/categories/columns"
import { Modal } from "@/components/modal"
import { CategoryForm } from "@/components/categories/category-form"

export default async function CategoriesPage() {

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
                                    <Modal
                                        name="category"
                                        FormComponent={CategoryForm}
                                    />
                                </div>
                                <DataTable columns={columns} />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
