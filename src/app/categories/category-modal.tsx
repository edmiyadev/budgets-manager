'use client'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Category } from "@/types/category"
import { useCategories } from "@/hooks/categories/useCategories"

interface Props {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon",
    category?: Category | null
    mode?: 'create' | 'edit'
    children?: React.ReactNode | null
}

const formSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2).max(50),
    amount: z.number().min(0, "Amount must be a positive number"),
    type: z.enum(["income", "expense"]),
})

export function CategoryModal({
    variant = "default",
    size = "default",
    children,
    category,
    mode = 'create',
}: Props) {

    const [open, setOpen] = useState(false);
    const { createUpdate } = useCategories(0, 10);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: category?.id || undefined,
            name: category?.name || "",
            amount: category?.amount || 0,
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
                console.log("Category created/updated successfully");
                setOpen(false);
                form.reset();
            },
            onError: (error) => {
                console.error("Error:", error);
            },
        });
    }

    const title = mode === 'create' ? 'Create Category' : 'Edit Category'
    const submitLabel = mode === 'create' ? 'Create' : 'Update'

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={size} variant={variant}>{children ? children : title}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Add a new category to organize your transactions.'
                            : 'Make changes to your category details.'
                        }
                    </DialogDescription>
                </DialogHeader>

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
                                                minLength={0}
                                                {...field}
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

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">{submitLabel}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
