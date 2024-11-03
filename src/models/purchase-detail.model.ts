import { z } from "zod";

export const PurchaseDetailSchema = z.object({
    id: z.string().uuid().optional(),
    purchase_id: z.string().uuid(),
    item_id: z.string().uuid(),
    presentation_id: z.string().uuid(),
    taxable: z.boolean(),
    amount: z.number().min(0),
    discount: z.number().min(0),
    price: z.number().min(0),
    total: z.number().min(0)
});

export type PurchaseDetail = z.infer<typeof PurchaseDetailSchema>

export const PurchaseDetail = {

}