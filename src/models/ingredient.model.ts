import { z } from "zod";
import { ITEM_TYPES, UMS } from "../utils/constants";
import { db } from "../lib/database";
import { ItemType } from "./item.model";

export const IngredientSchema = z.object({
    id: z.string().uuid(),
    type: z.enum(ITEM_TYPES),
    name: z.string(),
    base_um: z.enum(UMS),
    base_cost: z.number(),
    has_equivalence: z.boolean(),
    equivalence_um: z.enum(UMS).optional(),
    equivalence_amount: z.number().optional(),
    amount: z.number(),
    um: z.enum(UMS)
})

export type IngredientType = z.infer<typeof IngredientSchema>

export class Ingredient {

    static async getItemRecipe(item_id: string): Promise<IngredientType[]> {
        const query = `
                SELECT r.ingredient_id AS id, i.type, i.name, i.um AS base_um, i.cost_price AS base_cost, i.has_equivalence, i.equivalence_um, i.equivalence_amount, r.amount, r.um
                FROM recipes AS r
                INNER JOIN items AS i ON i.id = r.ingredient_id
                WHERE r.base_id = $1
            `
        const params = [item_id]

        const result = await db.query(query, params)
        return result.rows as IngredientType[]

    }

    static async getIngredientUses(ingredient_id: string): Promise<IngredientType[]> {
        const query = `
                SELECT r.base_id AS id, i.type, i.name, i.um AS base_um, i.cost_price AS base_cost, i.has_equivalence, i.equivalence_um, i.equivalence_amount, r.amount, r.um
                FROM recipes AS r
                INNER JOIN items AS i ON i.id = r.base_id
                WHERE r.ingredient_id = $1
            `
        const params = [ingredient_id]

        const result = await db.query(query, params)
        return result.rows as IngredientType[]
    }

    static async addIngredient(item_id: string, ingredient: IngredientType) {
        const query = `
                INSERT INTO recipes (base_id, ingredient_id, amount, um)
                VALUES ($1, $2, $3, $4)
            `
        const params = [item_id, ingredient.id, ingredient.amount, ingredient.um]

        await db.query(query, params)
    }

    static async updateIngredient(item_id: string, ingredient: IngredientType) {
        const query = `
            UPDATE recipes
            SET um = $1, amount = $2
            WHERE base_id = $3 AND ingredient_id = $4
        `
        const params = [ingredient.um, ingredient.amount, item_id, ingredient.id]

        await db.query(query, params)
    }

    static async deleteIngredient(item_id: string, ingredient: IngredientType) {
        const query = `
        DELETE FROM recipes
        WHERE base_id = $1 AND ingredient_id = $2
    `
        const params = [item_id, ingredient.id]

        await db.query(query, params)
    }

    static async searchIngredient(search: string, restaurant_id: string): Promise<IngredientType[]> {

        if (!search) return []

        const query = `
            SELECT *
            FROM items
            WHERE name ILIKE '%' || $1 || '%' AND restaurant_id = $2 AND (type = 'supplies' OR type = 'base-recipes' OR (type = 'products' AND subtype = 'unprocessed'))
            LIMIT 7
        `
        const params = [search, restaurant_id]

        const result = await db.query(query, params)

        const ingredients: IngredientType[] = (result.rows as ItemType[]).map(item => ({
            id: item.id!,
            type: item.type,
            name: item.name,
            base_um: item.um,
            base_cost: item.cost_price,
            has_equivalence: item.has_equivalence,
            equivalence_um: item.equivalence_um,
            equivalence_amount: item.equivalence_amount,
            amount: 1,
            um: item.um
        }))

        return ingredients
    }

}