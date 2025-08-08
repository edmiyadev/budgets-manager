import { useCategoriesStore, CategoryFormData } from "@/store/category.store";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCategories = (pageIndex = 0, pageSize = 10) => {

    const queryClient = useQueryClient();
    const { getCategories, createUpdateCategory, deleteCategory } = useCategoriesStore();


    const dataQuery = useQuery({
        queryKey: ['categories', pageIndex, pageSize],
        queryFn: () => getCategories(pageIndex - 1, pageSize),
        placeholderData: keepPreviousData,
    })

    const createUpdateMutation = useMutation({
        mutationFn: (formData: CategoryFormData) => createUpdateCategory(formData),
        onSuccess: () => {
            // Invalidar y refetch automáticamente
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error) => {
            console.error("Error creating/updating category:", error);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: () => {
            // Invalidar y refetch automáticamente
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error) => {
            console.error("Error deleting category:", error);
        },
    });

    return {
        dataQuery,
        createUpdate: createUpdateMutation,
        delete: deleteMutation,
    }
}
