import { useBudgetsStore, BudgetFormData } from "@/store/budget.store";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useBudgets = () => {
  const queryClient = useQueryClient();
  const {
    getBudgets,
    createUpdateBudget,
    deleteBudget,
  } = useBudgetsStore();

  const dataQuery = useQuery({
    queryKey: ["budgets"],
    queryFn: () => getBudgets(),
    placeholderData: keepPreviousData,
  });

  const createUpdateMutation = useMutation({
    mutationFn: (formData: BudgetFormData) => createUpdateBudget(formData),
    onSuccess: (_, variables) => {
      // Invalidar y refetch automáticamente
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success(variables.id ? "Budget updated successfully" : "Budget created successfully");
    },
    onError: (error) => {
      console.error("Error creating/updating budget:", error);
      toast.error("Failed to save budget");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      // Invalidar y refetch automáticamente
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget");
    },
  });

  return {
    dataQuery,
    createUpdate: createUpdateMutation,
    delete: deleteMutation,
  };
};
