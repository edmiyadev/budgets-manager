'use client'

import { useState } from "react"
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

interface Props<T = any> {
    name: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon",
    data?: T
    mode?: 'create' | 'edit'
    FormComponent: React.ComponentType<{ data?: T, idForm?: string, onClose: (open: boolean) => void }>
    children?: React.ReactNode | null
}

export function Modal<T = any>({
    name,
    data,
    FormComponent,
    children,
    variant = "default",
    size = "default",
    mode = 'create',
}: Props<T>) {
    const [open, setOpen] = useState(false);

    const capilizeName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const title = mode === 'create' ? `Create ${capilizeName(name)}` : `Edit ${capilizeName(name)}`

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="cursor-pointer" asChild>
                <Button size={size} variant={variant}>{children ?? title}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? `Add a new ${name} to organize your transactions.`
                            : `Make changes to your ${name} details.`
                        }
                    </DialogDescription>
                </DialogHeader>
                {/* Render the form component with the provided data and form ID  */}
                <FormComponent data={data} idForm={`${name}-form`} onClose={handleOpenChange} />

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" form={`${name}-form`}>{mode === 'create' ? 'Create' : 'Update'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
