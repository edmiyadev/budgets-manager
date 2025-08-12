import { create } from "zustand";
import { Budget, CreateBudget, UpdateBudget } from "@/types/budget";

interface BudgetFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budgetLines: {
    categoryId: string;
    amount: number;
  }[];
}

interface BudgetStore {
  // Modal states
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;

  // Current budget being edited/deleted
  currentBudget: Budget | null;

  // Form data
  formData: BudgetFormData;

  // Actions
  openCreateModal: () => void;
  closeCreateModal: () => void;

  openEditModal: (budget: Budget) => void;
  closeEditModal: () => void;

  openDeleteModal: (budget: Budget) => void;
  closeDeleteModal: () => void;

  setFormData: (data: Partial<BudgetFormData>) => void;
  resetFormData: () => void;

  // Helper methods
  getCreateBudgetData: () => CreateBudget;
  getUpdateBudgetData: () => UpdateBudget;
}

const initialFormData: BudgetFormData = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  budgetLines: [],
};

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  // Initial state
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  currentBudget: null,
  formData: initialFormData,

  // Modal actions
  openCreateModal: () => {
    set({
      isCreateModalOpen: true,
      formData: initialFormData,
      currentBudget: null,
    });
  },

  closeCreateModal: () => {
    set({
      isCreateModalOpen: false,
      formData: initialFormData,
    });
  },

  openEditModal: (budget: Budget) => {
    set({
      isEditModalOpen: true,
      currentBudget: budget,
      formData: {
        title: budget.title,
        description: budget.description || "",
        startDate: budget.startDate.split("T")[0], // Convert to date string
        endDate: budget.endDate ? budget.endDate.split("T")[0] : "",
        budgetLines: budget.budgetLines.map((line) => ({
          categoryId: line.categoryId,
          amount: line.amount,
        })),
      },
    });
  },

  closeEditModal: () => {
    set({
      isEditModalOpen: false,
      currentBudget: null,
      formData: initialFormData,
    });
  },

  openDeleteModal: (budget: Budget) => {
    set({
      isDeleteModalOpen: true,
      currentBudget: budget,
    });
  },

  closeDeleteModal: () => {
    set({
      isDeleteModalOpen: false,
      currentBudget: null,
    });
  },

  // Form data actions
  setFormData: (data: Partial<BudgetFormData>) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },

  resetFormData: () => {
    set({ formData: initialFormData });
  },

  // Helper methods
  getCreateBudgetData: (): CreateBudget => {
    const { formData } = get();
    return {
      title: formData.title,
      description: formData.description || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      totalExpected: formData.budgetLines.reduce(
        (sum, line) => sum + line.amount,
        0
      ),
      budgetLines: formData.budgetLines,
    };
  },

  getUpdateBudgetData: (): UpdateBudget => {
    const { formData, currentBudget } = get();
    if (!currentBudget) {
      throw new Error("No current budget to update");
    }

    return {
      id: currentBudget.id,
      title: formData.title,
      description: formData.description || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      totalExpected: formData.budgetLines.reduce(
        (sum, line) => sum + line.amount,
        0
      ),
      budgetLines: formData.budgetLines,
    };
  },
}));
