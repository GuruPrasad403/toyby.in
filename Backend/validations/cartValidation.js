import { z } from "zod";

export const CartValidationSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"), // Validates MongoDB ObjectId
      quantity: z.number().min(1, "Quantity must be at least 1").default(1), // Minimum value of 1
      price: z.number().positive("Price must be positive"), // Positive price value
    })
  ),
  totalPrice: z.number().nonnegative("Total price must be non-negative").default(0), // Non-negative total price
  status: z.enum(["active", "purchased"]).default("active"), // Enum for status
  createdAt: z.date().default(new Date()), // Default to current date
  updatedAt: z.date().default(new Date()), // Default to current date
});
