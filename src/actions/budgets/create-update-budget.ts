"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const budgetSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  totalExpected: z.number().min(0, "Total expected must be a positive number"),
  budgetLines: z
    .array(
      z.object({
        categoryId: z.string("Invalid category ID"),
        amount: z.number().min(0, "Amount must be a positive number"),
      })
    )
    .min(1, "At least one budget line is required"),
});

export async function createUpdateBudget(
  formData: z.infer<typeof budgetSchema>
) {
  const formDataValidated = budgetSchema.safeParse(formData);

  if (!formDataValidated.success) {
    throw new Error(`Validation failed: ${formDataValidated.error.message}`);
  }

  const { id, budgetLines, ...budgetData } = formDataValidated.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      let budget;

      if (id) {
        // Update existing budget
        budget = await tx.budget.update({
          where: { id },
          data: {
            ...budgetData,
            startDate: new Date(budgetData.startDate),
            endDate: budgetData.endDate ? new Date(budgetData.endDate) : null,
          },
        });

        // Delete existing budget lines
        await tx.budgetLine.deleteMany({
          where: { budgetId: id },
        });
      } else {
        // Create new budget
        budget = await tx.budget.create({
          data: {
            ...budgetData,
            startDate: new Date(budgetData.startDate),
            endDate: budgetData.endDate ? new Date(budgetData.endDate) : null,
          },
        });
      }

      // Create budget lines
      await Promise.all(
        budgetLines.map((line) =>
          tx.budgetLine.create({
            data: {
              budgetId: budget.id,
              categoryId: line.categoryId,
              amount: line.amount,
            },
          })
        )
      );

      // Return budget with lines
      return await tx.budget.findUnique({
        where: { id: budget.id },
        include: {
          budgetLines: {
            include: {
              category: true,
            },
          },
        },
      });
    });

    return result;
  } catch (error) {
    console.error("Error creating/updating budget:", error);
    throw new Error("Failed to create or update budget");
  }
}
