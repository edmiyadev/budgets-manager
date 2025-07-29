type CategotyType = "income" | "expense"

export interface Category {
  id: string
  name: string
  amount: number,
  type: CategotyType
}