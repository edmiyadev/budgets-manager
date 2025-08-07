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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Category } from "@/types/category"
import { useCategories } from "@/hooks/categories/useCategories"
import { useState } from "react"

const formSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2).max(50),
    amount: z.number().min(1, "Amount must be a positive number"),
    type: z.enum(["income", "expense"]),
})

interface Props {
    category?: Category | null
}


export const CategoryForm = ({ category }: Props) => {
    const [open, setOpen] = useState(false);
    const { createUpdate } = useCategories(0, 10);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: category?.id || undefined,
            name: category?.name || "",
            amount: category?.amount || undefined,
            type: category?.type || "income",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = values;

        if (category?.id !== undefined) {
            formData.id = category.id;
        }

        createUpdate.mutate(formData, {
            onSuccess: () => {
                setOpen(false);
                form.reset();
            },
            onError: (error) => {
                console.error("Error creating/updating category:", error);
            },
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* form fields */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-row justify-between gap-4 mb-8">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="100"
                                        type="number"
                                        min={0}
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="income">Income</SelectItem>
                                        <SelectItem value="expense">Expense</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    )
}
