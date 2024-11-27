import z from 'zod';

export const CategoryValidation = z.object({
    name: z.string()
        .min(3, "Name must be at least 3 characters.")
        .max(20, "Name must be at most 20 characters."),
    
    description: z.string()
        .min(5, "Description must be at least 5 characters.")
        .max(500, "Description must be at most 500 characters.")
        .optional(),
    
    image: z.string()
        .url("Image must be a valid URL."),
    
    status: z.boolean()
        .default(true)
        .optional(), // Optional because it has a default value
    
    parentCategory: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, "Parent Category must be a valid MongoDB ObjectId.") // Validates ObjectId format
        .optional(), // Optional for categories without a parent
});
