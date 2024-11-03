import { z } from "zod";

export const RegisterShiftSchema = z.object({
    id: z.string().uuid().optional(),
    opening_date: z.date(),
    closing_date: z.date(),
    worker_id: z.string().uuid(),
    register_id: z.string().uuid(),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type RegisterShift = z.infer<typeof RegisterShiftSchema>

export const RegisterShift = {

}