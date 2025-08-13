"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Budget } from "@/types/budget"
import { Textarea } from "../ui/textarea"
import CalendarForm from "../calendar-form"
import { Repeater } from "@/components/repeater"
import { useEffect } from "react"
import { useBudgets } from "@/hooks/budgets/useBudgets"

const formSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, "Title must be at least 2 characters").max(50, "Title must be less than 50 characters"),
    description: z.string().max(250, "Description must be less than 250 characters").optional(),
    startDate: z.date({ message: "Start date is required" }),
    endDate: z.date().optional(),
    budgetLines: z.array(z.object({
        id: z.string(),
        name: z.string(),
        amount: z.number().min(0, "Amount must be positive").optional(),
    })).min(1, "At least one budget line is required"),
    totalExpected: z.number().min(0, "Total expected must be a positive number"),
})

interface Props {
    idForm?: string
    data?: Budget | null,
    onClose: (open: boolean) => void
}

export const BudgetForm = ({ idForm, data, onClose }: Props) => {
    const { createUpdate } = useBudgets()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id || undefined,
            title: data?.title || "",
            description: data?.description || "",
            startDate: data?.startDate ? new Date(data.startDate) : new Date(),
            endDate: data?.endDate ? new Date(data.endDate) : undefined,
            budgetLines: data?.budgetLines.map(line => ({
                id: line.categoryId,
                name: line.category.name,
                amount: line.amount,
            })) || [],
            totalExpected: data?.totalExpected || 0,
        },
    })

    const watchedBudgetLines = form.watch("budgetLines")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = {
            id: values.id,
            title: values.title,
            description: values.description,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate?.toISOString(),
            totalExpected: values.totalExpected,
            budgetLines: values.budgetLines.map(line => ({
                categoryId: line.id,
                amount: line.amount || 0,
            })),
        }

        createUpdate.mutate(formData, {
            onSuccess: () => {
                onClose(false);
                form.reset();
            },
            onError: (error) => {
                console.error("Error creating/updating budget:", error);
            },
        });
    }

    useEffect(() => {
        const total = watchedBudgetLines?.reduce((sum, line) => {
            return sum + (line?.amount || 0);
        }, 0) || 0;

        form.setValue("totalExpected", total);
    }, [watchedBudgetLines, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id={idForm}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Budget April" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Budget for trip to Tokyo ..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-row justify-between gap-4 mb-8">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <CalendarForm label="Start Date" field={field} />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <CalendarForm label="End Date" field={field} />
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="budgetLines"
                    render={({ field }) => (
                        <Repeater field={field} />
                    )}
                />

                <FormField
                    control={form.control}
                    name="totalExpected"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between">
                                <FormLabel className="text-xl">Total Expected</FormLabel>
                                <FormLabel className="text-xl">RD$ {field.value.toFixed(2)}</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
