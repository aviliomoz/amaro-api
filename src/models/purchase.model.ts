import { z } from "zod";

export const PurchaseSchema = z.object({
    id: z.string().uuid().optional(),
    date: z.date(),
    document_type: z.enum(["invoice", "receipt", "note"]),
    document_serial: z.string().max(4),
    document_number: z.string().max(10),
    supplier_id: z.string().uuid(),
    subtotal: z.number().min(0),
    taxes: z.number().min(0),
    total: z.number().min(0),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type Purchase = z.infer<typeof PurchaseSchema>

export const Purchase = {

}