import { z } from "zod";

export const WorkerSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    lastname: z.string().max(100),
    pin: z.string().max(4),
    type: z.string().max(20),
    status: z.enum(["active", "inactive"]).default("active"),
    branch_id: z.string().uuid(),
});

export type Worker = z.infer<typeof WorkerSchema>

export const Worker = {

}