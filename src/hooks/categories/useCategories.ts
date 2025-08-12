import { useCategoriesStore, CategoryFormData } from "@/store/category.store";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useCategories = (pageIndex = 0, pageSize = 10) => {
  const queryClient = useQueryClient();
  const {
    getPaginatedCategories,
    createUpdateCategory,
    deleteCategory,
    getCategories,
  } = useCategoriesStore();

  const dataQuery = useQuery({
    queryKey: ["categories", pageIndex, pageSize],
    queryFn: () => getPaginatedCategories(pageIndex - 1, pageSize),
    placeholderData: keepPreviousData,
  });

  const allCategoriesQuery = useQuery({
    queryKey: ["categories", "all"],
    queryFn: () => getCategories(),
    staleTime: 5 * 60 * 1000,
  });

  const createUpdateMutation = useMutation({
    mutationFn: (formData: CategoryFormData) => createUpdateCategory(formData),
    onSuccess: () => {
      // Invalidar y refetch automáticamente
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error creating/updating category:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      // Invalidar y refetch automáticamente
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
    },
  });

  return {
    dataQuery,
    allCategories: allCategoriesQuery,
    createUpdate: createUpdateMutation,
    delete: deleteMutation,
  };
};
