"use server";

import prisma from "@/lib/prisma";
import { Budget } from "@/types/budget";
import type {
  Budget as PrismaBudget,
  BudgetLine as PrismaBudgetLine,
  Category as PrismaCategory,
} from "@/generated/prisma";

type BudgetWithLines = PrismaBudget & {
  budgetLines: (PrismaBudgetLine & {
    category: PrismaCategory;
  })[];
};

export async function getBudgets(): Promise<Budget[]> {
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

    return budgets.map((budget: BudgetWithLines) => ({
      id: budget.id,
      title: budget.title,
      description: budget.description,
      startDate: budget.startDate.toISOString(),
      endDate: budget.endDate?.toISOString() ?? null,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
      totalExpected: budget.totalExpected,
      budgetLines: budget.budgetLines.map((line) => ({
        id: line.id,
        amount: line.amount,
        budgetId: line.budgetId,
        categoryId: line.categoryId,
        createdAt: line.createdAt,
        updatedAt: line.updatedAt,
        category: {
          id: line.category.id,
          name: line.category.name,
          amount: line.category.amount,
          type: line.category.type as "income" | "expense",
          createdAt: line.category.createdAt,
          updatedAt: line.category.updatedAt,
        },
      })),
    }));
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw new Error("Failed to fetch budgets");
  }
}

export async function getBudgetById(id: string): Promise<Budget | null> {
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

    return {
      id: budget.id,
      title: budget.title,
      description: budget.description,
      startDate: budget.startDate.toISOString(),
      endDate: budget.endDate?.toISOString() ?? null,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
      totalExpected: budget.totalExpected,
      budgetLines: budget.budgetLines.map((line) => ({
        id: line.id,
        amount: line.amount,
        budgetId: line.budgetId,
        categoryId: line.categoryId,
        createdAt: line.createdAt,
        updatedAt: line.updatedAt,
        category: {
          id: line.category.id,
          name: line.category.name,
          amount: line.category.amount,
          type: line.category.type as "income" | "expense",
          createdAt: line.category.createdAt,
          updatedAt: line.category.updatedAt,
        },
      })),
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw new Error("Failed to fetch budget");
  }
}
