import { z } from "zod";

export const OrderDiscountSchema = z.object({
    id: z.string().uuid().optional(),
    order_id: z.string().uuid(),
    amount: z.number().min(0),
    description: z.string().max(255),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type OrderDiscount = z.infer<typeof OrderDiscountSchema>

export const OrderDiscount = {}