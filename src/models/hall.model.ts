import { z } from "zod";

export const HallSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    branch_id: z.string().uuid(),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type Hall = z.infer<typeof HallSchema>

export const Hall = {
    
}