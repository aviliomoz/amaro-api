import { z } from "zod";

export const PaymentMethodSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid(),
});

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>

export const PaymentMethod = {

}