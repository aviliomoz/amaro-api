import { z } from "zod";
import { Item } from "./item.model";
import { db } from "../lib/database";

export const ReplacementSchema = z.object({
    id: z.string().uuid().optional(),
    recipe_id: z.string().uuid(),
    item_id: z.string().uuid(),
    amount: z.number().min(0),
});

export type Replacement = z.infer<typeof ReplacementSchema>

type ReplacementItem = Item & {
    amount: number
}

export const Replacement = {

    getReplacementsByRecipe: async (recipe_id: string): Promise<ReplacementItem[]> => {
        const query = `
            SELECT i.*, r.amount FROM replacements AS r
            INNER JOIN items AS i
            ON i.id = r.item_id
            WHERE r.recipe_id = $1
        `
        const values = [recipe_id]

        const result = await db.query(query, values)
        return result.rows as ReplacementItem[]
    },

    addReplacementToRecipe: async (replacement: Replacement): Promise<void> => {
        const query = "INSERT INTO replacement (recipe_id, item_id, amount) VALUES ($1, $2, $3)"
        const values = [replacement.recipe_id, replacement.item_id, replacement.amount]

        await db.query(query, values)
    },

    removeReplacementFromRecipe: async (replacement: Replacement): Promise<void> => {
        const query = "DELETE replacements WHERE id = $1"
        const values = [replacement.id]

        await db.query(query, values)
    }

}