import { z } from "zod";

export const AreaSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    type: z.string().max(20),
    status: z.enum(["active", "inactive"]).default("active"),
    branch_id: z.string().uuid(),
});

export type Area = z.infer<typeof AreaSchema>

export const Area = {

}