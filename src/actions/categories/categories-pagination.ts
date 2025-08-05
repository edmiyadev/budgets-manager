"use server";

import prisma from "@/lib/prisma";
import { PaginationState } from "@tanstack/react-table";

export const getPaginatedCategories = async ({
  pageIndex = 0,
  pageSize = 10,
}: PaginationState) => {
  // Asegurar que pageIndex es válido (0-indexed)
  if (isNaN(Number(pageIndex)) || pageIndex < 0) pageIndex = 0;

  try {
    // get categories
    const categories = await prisma.category.findMany({
      take: pageSize,
      skip: pageIndex * pageSize,
    });

    // get totalPages
    const totalCount = await prisma.category.count({});
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      rows: categories,
      pageCount: totalPages,
      rowCount: totalCount,
    };
  } catch (error) {
    throw new Error("Error fetching categories: " + error);
  }
};
