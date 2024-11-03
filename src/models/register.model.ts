import { z } from "zod";

export const RegisterSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    serial: z.string().max(4),
    status: z.enum(["active", "inactive"]).default("active"),
    branch_id: z.string().uuid(),
});

export type Register = z.infer<typeof RegisterSchema>

export const Register = {}
