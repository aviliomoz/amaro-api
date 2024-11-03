import { z } from "zod";


export const BranchSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid(),
});

export type Branch = z.infer<typeof BranchSchema>

export const Branch = {

}