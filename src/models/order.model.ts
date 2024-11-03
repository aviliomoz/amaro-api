import { z } from "zod";

export const OrderSchema = z.object({
    id: z.string().uuid().optional(),
    date: z.date(),
    worker_id: z.string().uuid(),
    table_id: z.string().uuid(),
    item_id: z.string().uuid(),
    amount: z.number().min(0),
    price: z.number().min(0),
    total: z.number().min(0),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type Order = z.infer<typeof OrderSchema>

export const Order = {

}