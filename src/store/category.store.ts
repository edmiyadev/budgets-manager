import { getPaginatedCategories } from "@/actions/categories/categories-pagination";
import { createUpdateCategory } from "@/actions/categories/create-update-category";
import { deleteCategory } from "@/actions/categories/delete-category";
import { CategoryWithPagination } from "@/types/category";
import { create } from "zustand";

export interface CategoryFormData {
  id?: string;
  name: string;
  amount: number;
  type: "income" | "expense";
}

type CategoriesState = {
  categories: CategoryWithPagination;
  getCategories: (
    pageIndex: number,
    pageSize: number
  ) => Promise<CategoryWithPagination | undefined>;
  createUpdateCategory: (
    formData: CategoryFormData
  ) => Promise<CategoryWithPagination | undefined>;
  deleteCategory: (id: string) => Promise<boolean>;
};

const initialState: CategoryWithPagination = {
  rows: [],
  pageCount: 0,
  rowCount: 0,
};

export const useCategoriesStore = create<CategoriesState>()((set, get) => ({
  categories: initialState,

  getCategories: async (pageIndex, pageSize) => {
    try {
      const data = await getPaginatedCategories({
        pageIndex,
        pageSize,
      });

      set({ categories: data });
      return data;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  },

  createUpdateCategory: async (formData) => {
    console.log("categorias antes", get().categories);

    try {
      const data = await createUpdateCategory(formData);

      set((state) => {
        if (
          data.id &&
          state.categories.rows.some((cat) => cat.id === data.id)
        ) {
          return {
            categories: {
              ...state.categories,
              rows: state.categories.rows.map((category) =>
                category.id === data.id ? data : category
              ),
            },
          };
        } else {
          return {
            categories: {
              ...state.categories,
              rows: [...state.categories.rows, data],
              rowCount: state.categories.rowCount + 1,
            },
          };
        }
      });
      console.log("categorias despues", get().categories);

      return get().categories;
    } catch (error) {
      console.error("Error creating/updating category:", error);
      return undefined;
    }
  },

  deleteCategory: async (id: string) => {
    const success = await deleteCategory(id);

    if (!success) return false;

    set((state) => ({
      categories: {
        ...state.categories,
        rows: state.categories.rows.filter((category) => category.id !== id),
        rowCount: state.categories.rowCount - 1,
      },
    }));
    return true;
  },
}));
