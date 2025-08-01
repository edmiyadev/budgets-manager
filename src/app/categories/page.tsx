import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/app/categories/data-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { columns } from "@/app/categories/columns"
import { CategoryModal } from "@/app/categories/category-modal"
import { getPaginatedCategories } from "@/actions/categories/categories-pagination"
import { redirect } from "next/navigation"


interface Props {
    searchParams: {
        page?: string;
        take?: string;
    }
}

export default async function CategoriesPage({ searchParams }: Props) {

    const resolvedSearchParams = await searchParams;

    const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;
    const take = resolvedSearchParams.take ? parseInt(resolvedSearchParams.take) : 5;

    const categories = await getPaginatedCategories({ page, take });
    console.log("Categories data:", categories);
    
    if (categories.data.length === 0) redirect('/categories');

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
                                <DataTable columns={columns} data={categories} />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
