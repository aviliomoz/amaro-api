import { z } from "zod";

export const RegisterMovementSchema = z.object({
    id: z.string().uuid().optional(),
    register_shift_id: z.string().uuid(),
    date: z.date(),
    worker_id: z.string().uuid(),
    amount: z.number(),
    description: z.string().max(255),
    type: z.string().max(20),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type RegisterMovement = z.infer<typeof RegisterMovementSchema>

export const RegisterMovement = {

}