import { z } from 'zod';

// Zod schema for the 'item' in the order
const orderItemSchema = z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID format"), // Validates that productId is a valid Mongo ObjectId (24 hex characters)
    quantity: z.number().min(1, "Quantity must be at least 1").default(1),
    price: z.number().min(0, "Price must be a positive number"), // Ensures price is positive
});

// Zod schema for the order
export const orderSchema = z.object({
    items: z.array(orderItemSchema).min(1, "Order must contain at least one item"), // At least one item is required
    status: z.enum(['Pending', 'Shipped', 'Delivered', 'Cancelled']).default('Pending'), // Enum validation for status
    deliverDate: z.date().optional(), // Optional date
    createdAt: z.date().default(() => new Date()), // Default to current date if not provided
});

 export const StatusValidation = z.enum(['Pending', 'Shipped', 'Delivered', 'Cancelled'], " Status Shoul₫ be only  : ['Pending', 'Shipped', 'Delivered', 'Cancelled'] ")// Enum validation for status
