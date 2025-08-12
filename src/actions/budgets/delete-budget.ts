"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteBudget(id: string): Promise<void> {
  try {
    await prisma.budget.delete({
      where: { id },
    });

    revalidatePath("/budgets");
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw new Error("Failed to delete budget");
  }
}

export async function deleteBudgetLine(id: string): Promise<void> {
  try {
    await prisma.budgetLine.delete({
      where: { id },
    });

    revalidatePath("/budgets");
  } catch (error) {
    console.error("Error deleting budget line:", error);
    throw new Error("Failed to delete budget line");
  }
}
