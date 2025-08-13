"use client"

import { Budget } from "@/types/budget"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, DollarSignIcon, EditIcon, Trash2Icon } from "lucide-react"
import { useBudgets } from "@/hooks/budgets/useBudgets"
import { Modal } from "@/components/modal"
import { BudgetForm } from "./budget-form"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BudgetCardsProps {
    budgets: Budget[] | undefined
}

export const BudgetCards = ({ budgets }: BudgetCardsProps) => {
    if (!budgets || budgets.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No budgets created yet</p>
                <p className="text-muted-foreground">Create your first budget to get started</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
            ))}
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

    const getStatusBadge = () => {
        const now = new Date()
        const startDate = new Date(budget.startDate)
        const endDate = budget.endDate ? new Date(budget.endDate) : null

        if (startDate > now) {
            return <Badge variant="secondary">Upcoming</Badge>
        } else if (!endDate || endDate >= now) {
            return <Badge variant="default">Active</Badge>
        } else {
            return <Badge variant="destructive">Expired</Badge>
        }
    }

    const getTotalByType = (type: 'income' | 'expense') => {
        return budget.budgetLines
            .filter(line => line.category.type === type)
            .reduce((sum, line) => sum + line.amount, 0)
    }

    const totalIncome = getTotalByType('income')
    const totalExpenses = getTotalByType('expense')
    const netAmount = totalIncome - totalExpenses

    const handleDelete = () => {
        deleteBudget.mutate(budget.id)
    }

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold truncate">
                        {budget.title}
                    </CardTitle>
                    {getStatusBadge()}
                </div>
                {budget.description && (
                    <CardDescription className="truncate">
                        {budget.description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Date Range */}
                <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>
                        {formatDate(budget.startDate)}
                        {budget.endDate && ` - ${formatDate(budget.endDate)}`}
                    </span>
                </div>

                {/* Financial Summary */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600">Income:</span>
                        <span className="font-medium">{formatCurrency(totalIncome)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-red-600">Expenses:</span>
                        <span className="font-medium">{formatCurrency(totalExpenses)}</span>
                    </div>
                    <div className="border-t pt-2">
                        <div className="flex items-center justify-between font-semibold">
                            <span>Net Amount:</span>
                            <span className={netAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatCurrency(netAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Categories Count */}
                <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSignIcon className="w-4 h-4 mr-2" />
                    <span>{budget.budgetLines.length} categories</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                    <Modal
                        name="budget"
                        mode="edit"
                        data={budget}
                        FormComponent={BudgetForm}
                        variant="outline"
                        size="sm"
                    >
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                    </Modal>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Trash2Icon className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "{budget.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    )
}
