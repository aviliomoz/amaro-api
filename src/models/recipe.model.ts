import { z } from "zod";
import { db } from "../lib/database";

export const RecipeSchema = z.object({
    id: z.string().uuid().optional(),
    base_id: z.string().uuid(),
    ingredient_id: z.string().uuid(),
    waste: z.number().min(0),
    amount: z.number().min(0),
    um: z.string().max(5),
});

export type Recipe = z.infer<typeof RecipeSchema>

export type ProductRecipe = {


}

export const Recipe = {
    
    getRecipeBySubproduct: (base_id: string): Promise<ProductRecipe[]> => {},
    getRecipeByProduct: async (base_id: string): Promise<ProductRecipe[]> => {},
    getRecipeByCombo: (base_id: string): Promise<ProductRecipe[]> => {},

    addIngredientToItem: async (recipe: Recipe): Promise<void> => {
        const query = "INSERT INTO recipes (base_id, ingredient_id, waste, amount, um) VALUES ($1, $2, $3, $4, $5)"
        const values = [recipe.base_id, recipe.ingredient_id, recipe.waste, recipe.amount, recipe.um]

        await db.query(query, values)
    },

    removeIngredientFromItem: async (recipe: Recipe): Promise<void> => {
        const query = "DELETE recipes WHERE id = $1"
        const values = [recipe.id]

        await db.query(query, values)
    },

}