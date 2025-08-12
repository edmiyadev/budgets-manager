"use server";

import prisma from "@/lib/prisma";

export interface BudgetSummary {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  categoriesCount: number;
}

export async function getBudgetSummaries(): Promise<BudgetSummary[]> {
  try {
    const budgets = await prisma.budget.findMany({
      include: {
        budgetLines: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return budgets.map((budget) => {
      const totalIncome = budget.budgetLines
        .filter((line) => line.category.type === "income")
        .reduce((sum, line) => sum + line.amount, 0);

      const totalExpenses = budget.budgetLines
        .filter((line) => line.category.type === "expense")
        .reduce((sum, line) => sum + line.amount, 0);

      return {
        id: budget.id,
        title: budget.title,
        startDate: budget.startDate.toISOString(),
        endDate: budget.endDate?.toISOString() ?? null,
        totalIncome,
        totalExpenses,
        netAmount: totalIncome - totalExpenses,
        categoriesCount: budget.budgetLines.length,
      };
    });
  } catch (error) {
    console.error("Error fetching budget summaries:", error);
    throw new Error("Failed to fetch budget summaries");
  }
}

export async function getBudgetSummaryById(id: string): Promise<BudgetSummary | null> {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        budgetLines: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!budget) return null;

    const totalIncome = budget.budgetLines
      .filter((line) => line.category.type === "income")
      .reduce((sum, line) => sum + line.amount, 0);

    const totalExpenses = budget.budgetLines
      .filter((line) => line.category.type === "expense")
      .reduce((sum, line) => sum + line.amount, 0);

    return {
      id: budget.id,
      title: budget.title,
      startDate: budget.startDate.toISOString(),
      endDate: budget.endDate?.toISOString() ?? null,
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      categoriesCount: budget.budgetLines.length,
    };
  } catch (error) {
    console.error("Error fetching budget summary:", error);
    throw new Error("Failed to fetch budget summary");
  }
}
