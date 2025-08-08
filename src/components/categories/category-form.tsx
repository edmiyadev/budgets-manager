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

const formSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2).max(50),
    amount: z.number().min(1, "Amount must be a positive number"),
    type: z.enum(["income", "expense"]),
})

interface Props {
    idForm?: string
    data?: Category | null,
    onClose: (open: boolean) => void
}


export const CategoryForm = ({ data, idForm, onClose }: Props) => {
    const { createUpdate } = useCategories();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id || undefined,
            name: data?.name || "",
            amount: data?.amount || undefined,
            type: data?.type || "income",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = values;

        if (data?.id !== undefined) {
            formData.id = data.id;
        }

        createUpdate.mutate(formData, {
            onSuccess: () => {
                onClose(false);
                form.reset();
            },
            onError: (error) => {
                console.error("Error creating/updating category:", error);
            },
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id={idForm}>
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
