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
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useState } from "react"
import { Category } from "@/types/category"
import { useCategories } from "@/hooks/categories/useCategories"

interface Props {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon",
    category?: Category | null
    mode?: 'create' | 'edit'
    FormComponent: React.ComponentType<any>

    children?: React.ReactNode | null
}

const formSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2).max(50),
    amount: z.number().min(1, "Amount must be a positive number"),
    type: z.enum(["income", "expense"]),
})


export function Modal({
    variant = "default",
    size = "default",
    FormComponent,
    children,
    mode = 'create',
}: Props) {

    const [open, setOpen] = useState(false);
    const { createUpdate } = useCategories(0, 10);

    const title = mode === 'create' ? 'Create Category' : 'Edit Category'
    const submitLabel = mode === 'create' ? 'Create' : 'Update'

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="cursor-pointer" asChild>
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
                <FormComponent />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={() => form.reset()} variant="outline" type="button">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" form="category-form">{submitLabel}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}



// <Form {...form}>
//     <form id="category-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         {/* form fields */}
//         <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//                 <FormItem>
//                     <FormLabel>Name</FormLabel>
//                     <FormControl>
//                         <Input placeholder="Category name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//             )}
//         />

//         <div className="flex flex-row justify-between gap-4 mb-8">
//             <FormField
//                 control={form.control}
//                 name="amount"
//                 render={({ field }) => (
//                     <FormItem >
//                         <FormLabel>Amount</FormLabel>
//                         <FormControl>
//                             <Input
//                                 placeholder="100"
//                                 type="number"
//                                 min={0}
//                                 {...field}
//                                 value={field.value || ''}
//                                 onChange={(e) => field.onChange(Number(e.target.value))}
//                             />
//                         </FormControl>
//                         <FormMessage />
//                     </FormItem>
//                 )}
//             />

//             <FormField
//                 control={form.control}
//                 name="type"
//                 render={({ field }) => (
//                     <FormItem>
//                         <FormLabel>Type</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                             <FormControl>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select type" />
//                                 </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                                 <SelectItem value="income">Income</SelectItem>
//                                 <SelectItem value="expense">Expense</SelectItem>
//                             </SelectContent>
//                         </Select>
//                         <FormMessage />
//                     </FormItem>
//                 )}
//             />
//         </div>
//     </form>
// </Form>
