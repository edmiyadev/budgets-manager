"use server";

import prisma from "@/lib/prisma";
import { CreateBudget, UpdateBudget, Budget } from "@/types/budget";
import { revalidatePath } from "next/cache";

export async function createBudget(data: CreateBudget): Promise<Budget> {
  try {
    const budget = await prisma.budget.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        totalExpected: data.totalExpected,
        budgetLines: {
          create: data.budgetLines.map((line) => ({
            amount: line.amount,
            categoryId: line.categoryId,
          })),
        },
      },
      include: {
        budgetLines: {
          include: {
            category: true,
          },
        },
      },
    });

    revalidatePath("/budgets");

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
    console.error("Error creating budget:", error);
    throw new Error("Failed to create budget");
  }
}

export async function updateBudget(data: UpdateBudget): Promise<Budget> {
  try {
    // If budget lines are provided, we need to update them
    if (data.budgetLines) {
      // Delete existing budget lines and create new ones
      await prisma.budgetLine.deleteMany({
        where: { budgetId: data.id },
      });
    }

    const budget = await prisma.budget.update({
      where: { id: data.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { 
          endDate: data.endDate ? new Date(data.endDate) : null 
        }),
        ...(data.budgetLines && {
          budgetLines: {
            create: data.budgetLines.map((line) => ({
              amount: line.amount,
              categoryId: line.categoryId,
            })),
          },
        }),
      },
      include: {
        budgetLines: {
          include: {
            category: true,
          },
        },
      },
    });

    revalidatePath("/budgets");

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
    console.error("Error updating budget:", error);
    throw new Error("Failed to update budget");
  }
}
