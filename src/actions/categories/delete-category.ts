"use server";

import prisma from "@/lib/prisma";

export const deleteCategory = async (id: string) => {
  try {
    await prisma.category.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
};
