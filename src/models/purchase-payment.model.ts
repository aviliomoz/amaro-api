import { z } from "zod";

const PurchasePaymentSchema = z.object({
    id: z.string().uuid().optional(),
    purchase_id: z.string().uuid(),
    payment_method_id: z.string().uuid(),
    mode: z.enum(["credit", "cash"]),
    amount_paid: z.number().min(0),
    status: z.enum(["active", "inactive"]).default("active")
});

export type PurchasePayment = z.infer<typeof PurchasePaymentSchema>

export const PurchasePayment = {

}