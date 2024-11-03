import { z } from "zod";

export const SalePaymentSchema = z.object({
    id: z.string().uuid().optional(),
    sale_id: z.string().uuid(),
    payment_method_id: z.string().uuid(),
    mode: z.string().max(20),
    amount_paid: z.number().min(0),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type SalePayment = z.infer<typeof SalePaymentSchema>

export const SalePayment = {

}