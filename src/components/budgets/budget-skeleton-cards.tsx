import { Skeleton } from "../ui/skeleton"

interface Props {
    quantity?: number
}

export const BudgetSkeletonCards = ({ quantity = 6 }: Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(quantity)].map((_, i) => (
                <BudgetSkeletonCard key={i} />
            ))}
        </div>
    )
}


export const BudgetSkeletonCard = () => {
    return (
        <div>
            <Skeleton className="h-80 w-full" />
        </div>
    )
}

