import { z } from 'zod';

const ProductValidation = z.object({
    title: z.string().min(1, "Title is required"),
    discription: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid amount").optional(),
    discountPercentage: z.number().min(0).max(100).optional(),
    rating: z.number().min(0).max(5).optional(),
    imageUrls: z.array(z.string().url("Each image URL must be valid")).optional(),
    stock: z.number().min(0).default(0),
    brand: z.string().default("Generic"),
    Wheight: z.number().min(0).default(0),
    dimensions: z.object({
        width: z.number().min(0, "Width must be a non-negative number"),
        height: z.number().min(0, "Height must be a non-negative number"),
        deep: z.number().min(0, "Depth must be a non-negative number")
    }),
    warrantyInformation: z.string().min(1, "Warranty information is required"),
    shippingInformation: z.string().min(1, "Shipping information is required"),
    returnPolicy: z.string().default("7 Days Return"),
    minimumOrderQuantity: z.number().min(1).default(1),
    thumbnailImageUrls: z.array(z.string().url("Each thumbnail URL must be valid")).optional(),
    productType: z.string().min(1, "Product type is required"),
    isActive: z.boolean().default(false),

    // Toy-specific Fields
    ageRange: z.string().min(1, "Age range is required"),
    material: z.string().min(1, "Material is required"),
    safetyInformation: z.string().default("No small parts for children under 3"),
    tags: z.array(z.string()).optional()
});

export default ProductValidation;
