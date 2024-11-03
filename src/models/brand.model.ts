import { z } from "zod"

export const BrandSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    currency_code: z.string().length(3),
    purchase_tax: z.number().min(0),
    sales_tax: z.number().min(0),
    status: z.enum(["active", "inactive"]).default("active"),
})

export type Brand = z.infer<typeof BrandSchema>

export const Brand = {} 