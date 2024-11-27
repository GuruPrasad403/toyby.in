import z from 'zod';

const ImageValidation = z.object({
    title: z.string().max(99, "Maximum allowed is 100 characters").optional(),
    image: z.string().url().regex(/\.(jpeg|jpg|png|gif|svg)$/i, "Invalid image format"),
    description: z.string().max(499, "Maximum allowed is 499 characters").optional(),
    status: z.enum(["active", "inactive", "archived"]).default("active"),
});

export default ImageValidation;
