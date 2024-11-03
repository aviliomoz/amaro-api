import { z } from "zod";

export const RecipeSchema = z.object({
    id: z.string().uuid().optional(),
    base_id: z.string().uuid(),
    ingredient_id: z.string().uuid(),
    waste: z.number().min(0),
    amount: z.number().min(0),
    um: z.string().max(5),
});

export type Recipe = z.infer<typeof RecipeSchema>

export const Recipe = {

}