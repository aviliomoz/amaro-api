import { z } from "zod";
import { BASE_RECIPE_SUBTYPES, COMBO_SUBTYPES, ITEM_DISCHARGE_TYPE, ITEM_STATUSES, ITEM_TYPES, PRODUCT_SUBTYPES, SUPPLY_SUBTYPES, UMS } from "../utils/constants";
import { db } from "../lib/database";
import { ItemTypeEnum } from "../utils/types";

export const ItemSchema = z.object({
    id: z.string().uuid().optional(),
    internal_code: z.string().max(20).optional(),
    external_code: z.string().max(20).optional(),
    name: z.string(),
    category_id: z.string().uuid().optional(),
    type: z.enum(ITEM_TYPES),
    subtype: z.enum([...PRODUCT_SUBTYPES, ...COMBO_SUBTYPES, ...SUPPLY_SUBTYPES, ...BASE_RECIPE_SUBTYPES]),
    um: z.enum(UMS),
    taxable: z.boolean(),
    yield: z.number().min(0),
    waste: z.number().min(0).max(100),
    restaurant_id: z.string().uuid(),
    discharge_type: z.enum(ITEM_DISCHARGE_TYPE),
    sale_price: z.number(),
    purchase_price: z.number(),
    cost_price: z.number(),
    clean_price: z.number(),

    has_equivalence: z.boolean().optional().default(false),
    equivalence_um: z.enum(UMS).optional(),
    equivalence_amount: z.number().optional(),

    status: z.enum(ITEM_STATUSES),
})

export type ItemType = z.infer<typeof ItemSchema>

export class Item {

    static async getItems(restaurant_id: string, type: ItemTypeEnum): Promise<ItemType[]> {
        const query = `
            SELECT *
            FROM items
            WHERE restaurant_id = $1 AND type = $2 AND subtype != 'derivatives'
            ORDER BY name
        `
        const params = [restaurant_id, type]

        const result = await db.query(query, params)
        return result.rows as ItemType[]
    }

    static async getItemById(id: string): Promise<ItemType> {

        const query = `
            SELECT * 
            FROM items 
            WHERE id = $1
        `
        const params = [id]

        const result = await db.query(query, params)
        return result.rows[0] as ItemType
    }

    static async createItem(data: ItemType): Promise<ItemType> {

        const query = `
            INSERT INTO items (internal_code, external_code, name, category_id, type, subtype, um, taxable, yield, waste, restaurant_id, discharge_type, sale_price, purchase_price, cost_price, clean_price, has_equivalence, equivalence_um, equivalence_amount, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            RETURNING *
        `

        const params = [
            data.internal_code,
            data.external_code,
            data.name,
            data.category_id,
            data.type,
            data.subtype,
            data.um,
            data.taxable,
            data.yield,
            data.waste,
            data.restaurant_id,
            data.discharge_type,
            data.sale_price,
            data.purchase_price,
            data.cost_price,
            data.clean_price,
            data.has_equivalence,
            data.equivalence_um,
            data.equivalence_amount,
            data.status,
        ]

        const result = await db.query(query, params)
        return result.rows[0] as ItemType
    }

    static async updateItem(id: string, data: ItemType) {

        const query = `
            UPDATE items
            SET internal_code = $1, external_code = $2, name = $3, category_id = $4, type = $5, subtype = $6, um = $7, taxable = $8, yield = $9, waste = $10, restaurant_id = $11, discharge_type = $12, sale_price = $13, purchase_price = $14, cost_price = $15, clean_price = $16, has_equivalence = $17, equivalence_um = $18, equivalence_amount = $19, status = $20
            WHERE id = $21
        `

        const params = [
            data.internal_code,
            data.external_code,
            data.name,
            data.category_id,
            data.type,
            data.subtype,
            data.um,
            data.taxable,
            data.yield,
            data.waste,
            data.restaurant_id,
            data.discharge_type,
            data.sale_price,
            data.purchase_price,
            data.cost_price,
            data.clean_price,
            data.has_equivalence,
            data.equivalence_um,
            data.equivalence_amount,
            data.status,
            id
        ]

        await db.query(query, params)
    }

    static async searchItems(restaurant_id: string, search: string, type: string): Promise<ItemType[]> {
        const query = `
            SELECT *
            FROM items
            WHERE name ILIKE '%' || $1 || '%' AND restaurant_id = $2 AND type = $3
            LIMIT 7
        `
        const params = [`%${search}%`, restaurant_id, type]

        const result = await db.query(query, params)
        return result.rows as ItemType[]
    }
}