import { Prisma, Type } from "@/generated/prisma";
import prisma from "@/lib/prisma";

const categories: Prisma.CategoryCreateInput[] = [
  {
    name: "Food & Dining",
    amount: 316,
    type: Type.income,
  },
  {
    name: "Salary",
    amount: 242,
    type: Type.income,
  },
  {
    name: "Transportation",
    amount: 837,
    type: Type.expense,
  },
  {
    name: "Freelance",
    amount: 874,
    type: Type.income,
  },
  {
    name: "Entertainment",
    amount: 721,
    type: Type.expense,
  },
  {
    name: "Investment Returns",
    amount: 1500,
    type: Type.income,
  },
  {
    name: "Shopping",
    amount: 450,
    type: Type.expense,
  },
  {
    name: "Utilities",
    amount: 320,
    type: Type.expense,
  },
  {
    name: "Healthcare",
    amount: 280,
    type: Type.expense,
  },
  {
    name: "Education",
    amount: 600,
    type: Type.expense,
  },
  {
    name: "Rent",
    amount: 1200,
    type: Type.income,
  },
  {
    name: "Insurance",
    amount: 150,
    type: Type.expense,
  },
];

export async function main() {
  await prisma.category.deleteMany(); // Clear existing categories

  for (const category of categories) {
    await prisma.category.create({ data: category });
  }
}

main();
