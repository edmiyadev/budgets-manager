import { Category } from "@/types/category";

export interface BudgetLine {
  id: string;
  amount: number;
  budgetId: string;
  categoryId: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  budgetLines: BudgetLine[];
  createdAt: Date;
  updatedAt: Date;
  totalExpected: number;
}

// Helper interface for creating budgets
export interface CreateBudget {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  totalExpected: number;
  budgetLines: {
    categoryId: string;
    amount: number;
  }[];
}

// Helper interface for updating budgets
export interface UpdateBudget {
  id: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  totalExpected: number;
  budgetLines?: {
    id?: string;
    categoryId: string;
    amount: number;
  }[];
}
