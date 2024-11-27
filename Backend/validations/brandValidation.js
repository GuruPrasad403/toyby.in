import z from 'zod'

export const BrandValidation = z.object({
    name:z.string().min(3).max(10),
    status:z.enum(["active", "inactive", "archived"]).default("active"),
    description:z.string().min(10).max(499)
})