"use server";

import prisma from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getPaginatedCategories = async ({
  page = 1,
  take = 5,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    // get categories
    const categories = await prisma.category.findMany({
      take: take,
      skip: (page - 1) * take,
    });

    // get totalPages
    const totalCount = await prisma.category.count({});
    const totalPages = Math.ceil(totalCount / take);

    return {
      take: take,
      currentPage: page,
      totalPages: totalPages,
      data: categories,
    };
  } catch (error) {
    throw new Error("Error");
  }
};
