"use server";

import prisma from "@/lib/prisma";
import z from "zod";

const categorySchema = z.object({
  id: z.uuid().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(1, "Amount must be a positive number"),
  type: z.enum(["income", "expense"]),
});

export const createUpdateCategory = async (
  formData: z.infer<typeof categorySchema>
) => {
  const formDataValidated = categorySchema.safeParse(formData);

  if (!formDataValidated.success)
    throw new Error(`Validation failed: ${formDataValidated.error.message}`);

  const { id, ...data } = formDataValidated.data;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let category;

      if (id) {
        category = await tx.category.update({
          where: { id },
          data,
        });
      } else {
        category = await tx.category.create({
          data,
        });
      }

      return category;
    });

    return prismaTx;
  } catch (error) {
    throw new Error("Error creating or updating category: " + error);
  }
};
