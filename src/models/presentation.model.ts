import { z } from "zod";

export const PresentationSchema = z.object({
    id: z.string().uuid().optional(),
    item_id: z.string().uuid(),
    name: z.string().max(100),
    amount: z.number().min(0),
    um: z.enum(["und", "kg", "lt", "oz"]),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type Presentation = z.infer<typeof PresentationSchema>

export const Presentation = {

}