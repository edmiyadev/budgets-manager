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
import { Button } from "@/components/ui/button"
import { Trash2Icon } from "lucide-react"

interface BudgetAlertDialogProps {
    name: string
    title: string
    onDelete: () => void
}

export const DeleteAlertDialog = ({ name, title, onDelete }: BudgetAlertDialogProps) => {

    return (
        <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer" asChild>
                <Button className="cursor-pointer" variant="ghost" size="sm">
                    <Trash2Icon className="text-destructive" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {name}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete "{title}"? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
