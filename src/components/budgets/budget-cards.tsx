"use client"

import { Budget } from "@/types/budget"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, EditIcon } from "lucide-react"
import { useBudgets } from "@/hooks/budgets/useBudgets"
import { Modal } from "@/components/modal"
import { BudgetForm } from "@/components/budgets/budget-form"
import { DeleteAlertDialog } from "@/components/delete-alert-dialog"

interface BudgetCardsProps {
    budgets: Budget[]
}

export const BudgetCards = ({ budgets }: BudgetCardsProps) => {
    return (
        <div>
            {budgets.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No budgets created yet</p>
                    <p className="text-muted-foreground">Create your first budget to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map((budget) => (
                        <BudgetCard key={budget.id} budget={budget} />
                    ))}
                </div>
            )}
        </div>
    )
}


interface BudgetCardProps {
    budget: Budget
}

const BudgetCard = ({ budget }: BudgetCardProps) => {
    const { delete: deleteBudget } = useBudgets()

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP'
        }).format(amount)
    }

    const getTotalByType = (type: 'income' | 'expense') => {
        return budget.budgetLines
            .filter(line => line.category.type === type)
            .reduce((sum, line) => sum + line.amount, 0)
    }

    // const totalIncome = getTotalByType('income')
    const totalExpenses = getTotalByType('expense')
    const netAmount = /* totalIncome - */ totalExpenses

    const handleDelete = () => {
        deleteBudget.mutate(budget.id, {
            onSuccess: () => {
                console.log("Category deleted successfully");
            },
            onError: (error) => {
                console.error("Error deleting category:", error);
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{budget.title}</CardTitle>
                <CardDescription>{budget.description}</CardDescription>
                <CardAction>
                    <Modal
                        name="budget"
                        FormComponent={BudgetForm}
                        variant="ghost"
                        mode="edit"
                        data={budget}>
                        <EditIcon className="text-primary" />
                    </Modal>
                    <DeleteAlertDialog
                        name="budget"
                        title={budget.title}
                        onDelete={handleDelete}
                    />
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center text-sm text-muted-foreground">
                    <div className="flex">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span>
                            {formatDate(budget.startDate)}
                            {budget.endDate && ` - ${formatDate(budget.endDate)}`}
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="w-full flex justify-between font-semibold ">
                    <span>{budget.budgetLines.length} line items</span>

                    <span className='text-green-600'>
                        {formatCurrency(netAmount)}
                    </span>
                </div>
            </CardFooter>
        </Card>
    )
}
