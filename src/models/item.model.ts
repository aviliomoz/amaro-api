import { z } from "zod";
import { BASE_RECIPE_SUBTYPES, COMBO_SUBTYPES, ITEM_DISCHARGE_TYPE, ITEM_TYPES, PRODUCT_SUBTYPES, SUPPLY_SUBTYPES, UMS } from "../utils/constants";
import { db } from "../lib/database";
import { ItemTypeEnum } from "../utils/types";

export const ItemSchema = z.object({
    id: z.string().uuid().optional(),
    code: z.string().max(20).optional(),
    name: z.string(),
    category_id: z.string().uuid(),
    type: z.enum(ITEM_TYPES),
    subtype: z.enum([...PRODUCT_SUBTYPES, ...COMBO_SUBTYPES, ...SUPPLY_SUBTYPES, ...BASE_RECIPE_SUBTYPES]),
    status: z.string(),
    um: z.enum(UMS),
    taxable: z.boolean(),
    yield: z.number().min(0),
    waste: z.number().min(0).max(100),
    brand_id: z.string().uuid(),
    discharge_type: z.enum(ITEM_DISCHARGE_TYPE),
})

export const PricesSchema = z.object({
    sale_price: z.number(),
    purchase_price: z.number(),
    cost_price: z.number()
})

export const EquivalenceSchema = z.object({
    um: z.enum(UMS),
    amount: z.number().min(0)
})

export const IngredientSchema = z.object({
    id: z.string().uuid(),
    type: z.enum(ITEM_TYPES),
    name: z.string(),
    amount: z.number(),
    um: z.enum(UMS)
})

export const FullIngredientSchema = IngredientSchema.omit({ um: true }).extend({
    ums: z.array(z.object({
        um: z.enum(UMS),
        cost: z.number(),
        used: z.boolean()
    }))
})

export const FullItemSchema = ItemSchema.extend({
    prices: PricesSchema,
    equivalence: EquivalenceSchema.optional(),
    recipe: z.array(FullIngredientSchema)
})

export type ItemType = z.infer<typeof ItemSchema>
export type PricesType = z.infer<typeof PricesSchema>
export type EquivalenceType = z.infer<typeof EquivalenceSchema>
export type IngredientType = z.infer<typeof IngredientSchema>
export type FullIngredientType = z.infer<typeof FullIngredientSchema>
export type FullItemType = z.infer<typeof FullItemSchema>

export class Item {

    static async getItems(branch_id: string, type: ItemTypeEnum): Promise<ItemType[]> {
        const query = `
            SELECT i.*
            FROM items AS i
            INNER JOIN branch_items AS bi ON bi.item_id = i.id
            WHERE bi.branch_id = $1 AND i.type = $2
            ORDER BY i.name
        `
        const params = [branch_id, type]

        const result = await db.query(query, params)
        return result.rows as ItemType[]
    }

    static async getItemById(id: string): Promise<ItemType> {

        const query = `SELECT * FROM items WHERE id = $1`
        const params = [id]

        const result = await db.query(query, params)
        return result.rows[0] as ItemType
    }

    static async getItemPrices(item_id: string, branch_id: string): Promise<PricesType> {
        const query = `SELECT sale_price, purchase_price, cost_price FROM branch_items WHERE item_id = $1 AND branch_id = $2`
        const params = [item_id, branch_id]

        const result = await db.query(query, params)
        return result.rows[0] as PricesType
    }

    static async getItemEquivalence(item_id: string): Promise<EquivalenceType> {
        const query = `
            SELECT *
            FROM equivalences
            WHERE item_id = $1
        `
        const params = [item_id]

        const result = await db.query(query, params)
        return result.rows[0] as EquivalenceType
    }

    static async getItemRecipe(item_id: string, branch_id: string): Promise<FullIngredientType[]> {
        const query = `
            SELECT r.ingredient_id AS id, i.type, i.name, r.amount, r.um
            FROM recipes AS r
            INNER JOIN items AS i ON i.id = r.ingredient_id
            WHERE r.base_id = $1
        `
        const params = [item_id]

        const result = await db.query(query, params)
        const ingredients = result.rows as IngredientType[]

        let fullIngredients: FullIngredientType[] = []

        for await (const ingredient of ingredients) {
            const [item, prices, equivalence] = await Promise.all([
                Item.getItemById(ingredient.id),
                Item.getItemPrices(ingredient.id, branch_id),
                Item.getItemEquivalence(ingredient.id)
            ])

            let ums = [
                {
                    um: item.um,
                    cost: prices.cost_price,
                    used: ingredient.um === item.um
                }
            ]

            if (equivalence) {
                ums.push({
                    um: equivalence.um,
                    cost: (prices.cost_price / equivalence.amount) || 0,
                    used: ingredient.um === equivalence.um
                })

                if (equivalence.um === "kilogram") {
                    ums.push({
                        um: "ounce",
                        cost: (prices.cost_price / (equivalence.amount / 0.0283495)) || 0,
                        used: ingredient.um === "ounce"
                    })
                }

                if (equivalence.um === "liter") {
                    ums.push({
                        um: "ounce",
                        cost: (prices.cost_price / (equivalence.amount / 0.0295735)) || 0,
                        used: ingredient.um === "ounce"
                    })
                }
            }

            fullIngredients.push({
                id: ingredient.id,
                type: ingredient.type,
                name: item.name,
                amount: ingredient.amount,
                ums
            })
        }

        return fullIngredients
    }

    static async createItem(data: ItemType): Promise<ItemType> {

        const query = `
            INSERT INTO items (code, name, category_id, type, subtype, status, um, taxable, yield, waste, brand_id, discharge_type)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `

        const params = [
            data.code,
            data.name,
            data.category_id,
            data.type,
            data.subtype,
            data.status,
            data.um,
            data.taxable,
            data.yield,
            data.waste,
            data.brand_id,
            data.discharge_type,
        ]

        const result = await db.query(query, params)
        return result.rows[0] as ItemType
    }

    static async addItemToBranch(branch_id: string, item_id: string, sale_price: number, purchase_price: number, cost_price: number) {
        const query = `
            INSERT INTO branch_items (branch_id, item_id, sale_price, purchase_price, cost_price)
            VALUES ($1, $2, $3, $4, $5)
        `

        const params = [branch_id, item_id, sale_price, purchase_price, cost_price]

        await db.query(query, params)
    }

    static async addItemEquivalence(item_id: string, equivalence: EquivalenceType): Promise<EquivalenceType> {

        const query = `
            INSERT INTO equivalences (item_id, um, amount)
            VALUES ($1, $2, $3)
            RETURNING *
        `
        const params = [item_id, equivalence.um, equivalence.amount]

        const result = await db.query(query, params)
        return result.rows[0] as EquivalenceType
    }

    static async addIngredient(item_id: string, ingredient: FullIngredientType) {
        const query = `
            INSERT INTO recipes (base_id, ingredient_id, amount, um)
            VALUES ($1, $2, $3, $4)
        `
        const params = [item_id, ingredient.id, ingredient.amount, ingredient.ums.find(ingr => ingr.used)?.um]
        await db.query(query, params)
    }

    static async updateItem(id: string, data: ItemType): Promise<ItemType> {

        const query = `
            UPDATE items
            SET code = $1, name = $2, category_id = $3, type = $4, subtype = $5, status = $6, um = $7, taxable = $8, yield = $9, waste = $10, brand_id = $11, discharge_type = $12
            WHERE id = $13
            RETURNING *
        `

        const params = [
            data.code,
            data.name,
            data.category_id,
            data.type,
            data.subtype,
            data.status,
            data.um,
            data.taxable,
            data.yield,
            data.waste,
            data.brand_id,
            data.discharge_type,
            id
        ]

        const result = await db.query(query, params)
        return result.rows[0] as ItemType
    }

    static async updateItemOnBranch(branch_id: string, item_id: string, sale_price: number, purchase_price: number, cost_price: number) {
        const query = `
            UPDATE branch_items
            SET sale_price = $3, purchase_price = $4, cost_price = $5
            WHERE branch_id = $1 AND item_id = $2
        `

        const params = [branch_id, item_id, sale_price, purchase_price, cost_price]

        await db.query(query, params)
    }

    static async updateItemEquivalence(item_id: string, equivalence: EquivalenceType): Promise<EquivalenceType> {

        const query = `
            UPDATE equivalences
            SET um = $1, amount = $2
            WHERE item_id = $3
        `
        const params = [equivalence.um, equivalence.amount, item_id]

        const result = await db.query(query, params)
        return result.rows[0] as EquivalenceType
    }

    static async updateIngredient(item_id: string, ingredient: FullIngredientType) {
        const query = `
            UPDATE recipes
            SET um = $1, amount = $2
            WHERE base_id = $3 AND ingredient_id = $4
        `
        const params = [ingredient.ums.find(ingr => ingr.used)?.um, ingredient.amount, item_id, ingredient.id]

        await db.query(query, params)
    }

    static async deleteItemEquivalence(item_id: string) {
        const query = "DELETE FROM equivalences WHERE item_id = $1"
        const params = [item_id]

        await db.query(query, params)
    }

    static async deleteIngredient(item_id: string, ingredient: FullIngredientType) {
        const query = `
        DELETE FROM recipes
        WHERE base_id = $1 AND ingredient_id = $2
    `
        const params = [item_id, ingredient.id]

        await db.query(query, params)
    }

    static async searchIngredient(search: string, branch_id: string) {
        const query = `
            SELECT i.id, i.type, i.name, 1 AS amount, i.um
            FROM items AS i
            INNER JOIN branch_items AS bi ON bi.item_id = i.id
            WHERE i.name ILIKE '%' || $1 || '%' AND bi.branch_id = $2 AND (i.type = 'supplies' OR i.type = 'base-recipes' OR (i.type = 'products' AND i.subtype = 'unprocessed'))
            LIMIT 4
        `
        const params = [search, branch_id]

        const result = await db.query(query, params)
        const ingredients = result.rows as IngredientType[]

        let fullIngredients: FullIngredientType[] = []

        for await (const ingredient of ingredients) {
            const [item, prices, equivalence] = await Promise.all([
                Item.getItemById(ingredient.id),
                Item.getItemPrices(ingredient.id, branch_id),
                Item.getItemEquivalence(ingredient.id)
            ])

            let ums = [
                {
                    um: item.um,
                    cost: prices.cost_price,
                    used: ingredient.um === item.um
                }
            ]

            if (equivalence) {
                ums.push({
                    um: equivalence.um,
                    cost: (prices.cost_price / equivalence.amount) || 0,
                    used: ingredient.um === equivalence.um
                })

                if (equivalence.um === "kilogram") {
                    ums.push({
                        um: "ounce",
                        cost: (prices.cost_price / (equivalence.amount / 0.0283495)) || 0,
                        used: ingredient.um === "ounce"
                    })
                }

                if (equivalence.um === "liter") {
                    ums.push({
                        um: "ounce",
                        cost: (prices.cost_price / (equivalence.amount / 0.0295735)) || 0,
                        used: ingredient.um === "ounce"
                    })
                }
            }

            fullIngredients.push({
                id: ingredient.id,
                type: ingredient.type,
                name: item.name,
                amount: ingredient.amount,
                ums
            })
        }

        return fullIngredients
    }
}