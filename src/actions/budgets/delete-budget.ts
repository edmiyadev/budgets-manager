"use server";

import prisma from "@/lib/prisma";

export async function deleteBudget(id: string): Promise<boolean> {
  try {
    await prisma.budget.delete({
      where: { id },
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting budget:", error);
    return false;
  }
}
