import z from 'zod'
const addressValidation = z.object({
    street:z.string().min(10).max(100),
    Zip:z.number().max(6),
    City:z.string().min(3).max(50),
    District:z.string().min(3).max(50),
    Country:z.string().min(3).max(50)
})


export const userValidation = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(5).max(15),
    isAdmin:z.boolean().default(false),
    isVarified :z.boolean().default(false),
    phone:z.string().max(10),

})





