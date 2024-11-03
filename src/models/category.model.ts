import { z } from "zod";

export const CategorySchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    type: z.string().max(20),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid(),
});

export type Category = z.infer<typeof CategorySchema>

export const Category = {

}