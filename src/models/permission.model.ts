import { z } from "zod";

export const PermissionSchema = z.object({
    id: z.string().uuid().optional(),
    code: z.string().max(5),
    description: z.string().max(255),
});

export type Permission = z.infer<typeof PermissionSchema>

export const Permission = {

}