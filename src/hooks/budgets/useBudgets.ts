import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getBudgets,
  getBudgetById,
} from "@/actions/budgets/get-budgets";
import {
  createBudget,
  updateBudget,
} from "@/actions/budgets/create-update-budget";
import { deleteBudget } from "@/actions/budgets/delete-budget";
import {
  getBudgetSummaries,
  getBudgetSummaryById,
} from "@/actions/budgets/budget-summary";
import type { CreateBudget, UpdateBudget } from "@/types/budget";

export const useBudgets = () => {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: getBudgets,
  });
};

export const useBudget = (id: string) => {
  return useQuery({
    queryKey: ["budget", id],
    queryFn: () => getBudgetById(id),
    enabled: !!id,
  });
};

export const useBudgetSummaries = () => {
  return useQuery({
    queryKey: ["budget-summaries"],
    queryFn: getBudgetSummaries,
  });
};

export const useBudgetSummary = (id: string) => {
  return useQuery({
    queryKey: ["budget-summary", id],
    queryFn: () => getBudgetSummaryById(id),
    enabled: !!id,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudget) => createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget-summaries"] });
      toast.success("Budget created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create budget");
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBudget) => updateBudget(data),
    onSuccess: (updatedBudget) => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget", updatedBudget.id] });
      queryClient.invalidateQueries({ queryKey: ["budget-summaries"] });
      queryClient.invalidateQueries({ queryKey: ["budget-summary", updatedBudget.id] });
      toast.success("Budget updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update budget");
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget-summaries"] });
      toast.success("Budget deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete budget");
    },
  });
};
