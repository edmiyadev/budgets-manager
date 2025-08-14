"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { BudgetForm } from "@/components/budgets/budget-form"
import { BudgetCards } from "@/components/budgets/budget-cards"
import { Modal } from "@/components/modal"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useBudgets } from "@/hooks/budgets/useBudgets"
import { BudgetSkeletonCards } from "@/components/budgets/budget-skeleton-cards"
export default function BudgetsPage() {
  const { dataQuery } = useBudgets()

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
        <SiteHeader title="Budgets" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex flex-col items-end mb-6">
                  <Modal
                    name="budget"
                    FormComponent={BudgetForm}
                  />
                </div>
                {dataQuery.isLoading ? (
                  <BudgetSkeletonCards />
                ) : (
                  <BudgetCards budgets={dataQuery.data ?? []} />
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
