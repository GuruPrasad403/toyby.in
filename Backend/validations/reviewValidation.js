import { z } from "zod";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

// Zod validation schema
export const reviewValidationSchema = z.object({
  review: z.array(
    z.object({
      productId: z.string().refine((id) => ObjectId.isValid(id), {
        message: "Invalid product ID",
      }),
      title: z.string(),
      description: z.string(),
      rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    })
  ),
});


export const reviewUpdateValidation = z.object({
  
    productId: z.string().refine((id) => ObjectId.isValid(id), {
      message: "Invalid product ID",
    }),
    title: z.string(),
    description:z.string(),
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  
})