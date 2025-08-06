export type CategoryType = "income" | "expense"

export interface Category {
  id: string
  name: string
  amount: number,
  type: CategoryType,
  createdAt?: Date,
  updatedAt?: Date,
}

export interface CategoryWithPagination {
  rows: Category[];
  pageCount: number ;
  rowCount: number;
}