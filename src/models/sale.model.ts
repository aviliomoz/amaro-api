import { z } from "zod";

export const SaleSchema = z.object({
    id: z.string().uuid().optional(),
    date: z.date(),
    document_type: z.string().max(20),
    document_serial: z.string().max(4),
    document_number: z.string().max(10),
    register_shift_id: z.string().uuid(),
    worker_id: z.string().uuid(),
    customer_id: z.string().uuid(),
    subtotal: z.number().min(0),
    taxes: z.number().min(0),
    total: z.number().min(0),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type Sale = z.infer<typeof SaleSchema>

export const Sale = {

}