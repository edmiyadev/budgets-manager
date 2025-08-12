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


const formSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(250).optional(),
    startDate: z.date(),
    endDate: z.date().optional(),
    categories: z.array(z.object({
        id: z.string(),
        name: z.string(),
        amount: z.number().optional(),
    })).min(1, "At least one category is required"),
    totalExpected: z.number().min(0, "Total expected must be a positive number"),
})

interface Props {
    idForm?: string
    data?: Budget | null,
    onClose: (open: boolean) => void
}

export const BudgetForm = ({ idForm, data, onClose }: Props) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: data?.id || undefined,
            title: data?.title || "",
            startDate: data?.startDate ? new Date(data.startDate) : new Date(),
            endDate: data?.endDate ? new Date(data.endDate) : new Date(),
            categories: data?.categories || [],
            totalExpected: data?.totalExpected || 0,
        },
    })

    const watchedCategories = form.watch("categories");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = values;

        if (data?.id !== undefined) {
            formData.id = data.id;
        }

        // createUpdate.mutate(formData, {
        //     onSuccess: () => {
        //         onClose(false);
        //         form.reset();
        //     },
        //     onError: (error) => {
        //         console.error("Error creating/updating category:", error);
        //     },
        // });
    }

    console.log(watchedCategories);

    useEffect(() => {
        const total = watchedCategories.reduce((sum, category) => {
            return sum + (category.amount || 0);
        }, 0);

        form.setValue("totalExpected", total);
    }, [watchedCategories, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id={idForm}>
                {/* form fields */}
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
                    name="categories"
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
                                <FormLabel className="text-xl">RD$ {field.value}</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
            </form>
        </Form >
    )
}
