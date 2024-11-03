import { z } from "zod";

export const SupplierSchema = z.object({
    id: z.string().uuid().optional(),
    document_type: z.enum(["ruc"]),
    document_number: z.string().max(20),
    name: z.string().max(100),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid()
});

export type Supplier = z.infer<typeof SupplierSchema>

export const Supplier = {

}