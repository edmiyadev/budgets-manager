import { getBudgets } from "@/actions/budgets/get-budgets";
import { createUpdateBudget } from "@/actions/budgets/create-update-budget";
import { deleteBudget } from "@/actions/budgets/delete-budget";
import { Budget } from "@/types/budget";
import { create } from "zustand";

export interface BudgetFormData {
  id?: string;
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

type BudgetsState = {
  budgets: Budget[];
  isLoading: boolean;
  getBudgets: () => Promise<Budget[] | undefined>;
  createUpdateBudget: (formData: BudgetFormData) => Promise<Budget[] | undefined>;
  deleteBudget: (id: string) => Promise<boolean>;
};

export const useBudgetsStore = create<BudgetsState>()((set, get) => ({
  budgets: [],
  isLoading: false,

  getBudgets: async () => {
    try {
      set({ isLoading: true });
      const budgets = await getBudgets();
      set({ budgets, isLoading: false });
      return budgets;
    } catch (error) {
      console.error("Error fetching budgets:", error);
      set({ isLoading: false });
      return undefined;
    }
  },

  createUpdateBudget: async (formData) => {
    try {
      await createUpdateBudget(formData);
      
      // Refresh budgets list
      const updatedBudgets = await getBudgets();
      set({ budgets: updatedBudgets });
      return updatedBudgets;
    } catch (error) {
      console.error("Error creating/updating budget:", error);
      return undefined;
    }
  },

  deleteBudget: async (id: string) => {
    try {
      const success = await deleteBudget(id);
      
      if (success) {
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id),
        }));
      }
      
      return success;
    } catch (error) {
      console.error("Error deleting budget:", error);
      return false;
    }
  },
}));