"use server";

import prisma from "@/lib/prisma";

export const getCategories = async () => {
  try {
    // get categories
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: categories,
    };
  } catch (error) {
    throw new Error("Error fetching categories: " + error);
  }
};
