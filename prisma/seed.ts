import { Prisma, Type } from "@/generated/prisma";
import prisma from "@/lib/prisma";

const categories: Prisma.CategoryCreateInput[] = [
  {
    name: "Food & Dining",
    amount: 316,
    type: Type.EXPENSE,
  },
  {
    name: "Salary",
    amount: 242,
    type: Type.INCOME,
  },
  {
    name: "Transportation",
    amount: 837,
    type: Type.EXPENSE,
  },
  {
    name: "Freelance",
    amount: 874,
    type: Type.INCOME,
  },
  {
    name: "Entertainment",
    amount: 721,
    type: Type.EXPENSE,
  },
  {
    name: "Investment Returns",
    amount: 1500,
    type: Type.INCOME,
  },
  {
    name: "Shopping",
    amount: 450,
    type: Type.EXPENSE,
  },
  {
    name: "Utilities",
    amount: 320,
    type: Type.EXPENSE,
  },
  {
    name: "Healthcare",
    amount: 280,
    type: Type.EXPENSE,
  },
  {
    name: "Education",
    amount: 600,
    type: Type.EXPENSE,
  },
  {
    name: "Rent INCOME",
    amount: 1200,
    type: Type.INCOME,
  },
  {
    name: "Insurance",
    amount: 150,
    type: Type.EXPENSE,
  },
];

export async function main() {
  await prisma.category.deleteMany(); // Clear existing categories

  for (const category of categories) {
    await prisma.category.create({ data: category });
  }
}

main();
