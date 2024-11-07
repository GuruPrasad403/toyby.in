import z from 'zod';

export const Validation = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(5).max(15),
    isAdmin: z.boolean().default(false),
    isVarified: z.boolean().default(false),
    phone: z.string().max(10),
    address: z.object({
        street: z.string().min(3).max(15),
        city: z.string().min(3).max(15),
        state: z.string().min(3).max(15),
        postalCode: z.string().max(6),
        country: z.string().min(3).max(15)
    }).optional() // Make the entire address field optional if it's not required
});
