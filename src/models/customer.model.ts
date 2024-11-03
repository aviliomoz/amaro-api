import { z } from "zod";

export const CustomerSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    document_type: z.string().max(20),
    document_number: z.string().max(20),
    type: z.string().max(20),
    credit_limit: z.number().min(0),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid(),
});

export type Customer = z.infer<typeof CustomerSchema>

export const Customer = {

}