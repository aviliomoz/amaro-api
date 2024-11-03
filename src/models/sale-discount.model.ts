import { z } from "zod";

export const SaleDiscountSchema = z.object({
    id: z.string().uuid().optional(),
    sale_id: z.string().uuid(),
    amount: z.number().min(0),
    description: z.string().max(255),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type SaleDiscount = z.infer<typeof SaleDiscountSchema>

export const SaleDiscount = {

}