import { z } from "zod";

export const ItemSchema = z.object({
    id: z.string().uuid().optional(),
    category_id: z.string().uuid(),
    name: z.string().max(100),
    type: z.string().max(20),
    taxable: z.boolean(),
    status: z.enum(["active", "inactive"]).default("active"),
    price: z.number().min(0),
    um: z.string().max(5),
    cost: z.number().min(0),
    yield: z.number().min(0),
    is_transformed: z.boolean(),
});

export type Item = z.infer<typeof ItemSchema>

export const Item = {

}