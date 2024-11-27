import z from 'zod';

export const collectionValidation = z.object({
    collectionName: z.enum(["New-Collection", "New-Arrivals", "Best-Sellers"]),
    productId: z.string().refine((id) => /^[a-fA-F0-9]{24}$/.test(id), {
        message: "Invalid product ID format. Must be a 24-character hex string.",
    }),
});
