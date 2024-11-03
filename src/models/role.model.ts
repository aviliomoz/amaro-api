import { z } from "zod";

export const RoleSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid(),
});

export type Role = z.infer<typeof RoleSchema>

export const Role = {

}