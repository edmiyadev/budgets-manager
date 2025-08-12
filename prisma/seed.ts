import { Prisma, Type } from "@/generated/prisma";
import prisma from "@/lib/prisma";

const categories: Prisma.CategoryCreateInput[] = [
  {
    name: "Food & Dining",
    amount: 316,
    type: Type.expense,
  },
  {
    name: "Salary",
    amount: 5000,
    type: Type.income,
  },
  {
    name: "Transportation",
    amount: 300,
    type: Type.expense,
  },
  {
    name: "Freelance",
    amount: 874,
    type: Type.income,
  },
  {
    name: "Entertainment",
    amount: 200,
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
    type: Type.expense,
  },
  {
    name: "Insurance",
    amount: 150,
    type: Type.expense,
  },
];

export async function main() {
  // Clear existing data
  await prisma.budgetLine.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.create({ data: category });
    createdCategories.push(created);
  }

  // Create sample budgets
  const salaryCategory = createdCategories.find(c => c.name === "Salary");
  const freelanceCategory = createdCategories.find(c => c.name === "Freelance");
  const investmentCategory = createdCategories.find(c => c.name === "Investment Returns");
  const rentCategory = createdCategories.find(c => c.name === "Rent");
  const foodCategory = createdCategories.find(c => c.name === "Food & Dining");
  const transportCategory = createdCategories.find(c => c.name === "Transportation");
  const utilitiesCategory = createdCategories.find(c => c.name === "Utilities");

  if (salaryCategory && freelanceCategory && investmentCategory && rentCategory && foodCategory && transportCategory && utilitiesCategory) {
    // Create January 2025 Budget
    await prisma.budget.create({
      data: {
        title: "January 2025 Budget",
        description: "Monthly budget for January 2025",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-31"),
        totalExpected: 10000,
        budgetLines: {
          create: [
            {
              categoryId: salaryCategory.id,
              amount: 5000,
            },
            {
              categoryId: freelanceCategory.id,
              amount: 1000,
            },
            {
              categoryId: rentCategory.id,
              amount: 1200,
            },
            {
              categoryId: foodCategory.id,
              amount: 400,
            },
            {
              categoryId: transportCategory.id,
              amount: 200,
            },
            {
              categoryId: utilitiesCategory.id,
              amount: 150,
            },
          ],
        },
      },
    });

    // Create Q1 2025 Budget
    await prisma.budget.create({
      data: {
        title: "Q1 2025 Budget",
        description: "Quarterly budget for first quarter of 2025",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-03-31"),
        totalExpected: 50000,
        budgetLines: {
          create: [
            {
              categoryId: salaryCategory.id,
              amount: 15000, // 3 months
            },
            {
              categoryId: freelanceCategory.id,
              amount: 2500,
            },
            {
              categoryId: investmentCategory.id,
              amount: 4500,
            },
            {
              categoryId: rentCategory.id,
              amount: 3600, // 3 months
            },
            {
              categoryId: foodCategory.id,
              amount: 1200,
            },
            {
              categoryId: transportCategory.id,
              amount: 600,
            },
            {
              categoryId: utilitiesCategory.id,
              amount: 450,
            },
          ],
        },
      },
    });
  }

  console.log("Seed data created successfully!");
}

main();
