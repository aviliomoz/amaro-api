import { z } from "zod";

export const ReplacementSchema = z.object({
    id: z.string().uuid().optional(),
    recipe_id: z.string().uuid(),
    item_id: z.string().uuid(),
    amount: z.number().min(0),
});

export type Replacement = z.infer<typeof ReplacementSchema>

export const Replacement = {

}