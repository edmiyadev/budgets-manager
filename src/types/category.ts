export type CategoryType = "INCOME" | "EXPENSE"

export interface Category {
  id: string
  name: string
  amount: number,
  type: CategoryType,
  createdAt?: Date,
  updatedAt?: Date,
}