import { z } from "zod";
import { ITEM_TYPES } from "../utils/constants";
import { ItemType } from "../utils/types";
import { db } from "../lib/database";

export const ItemSchema = z.object({
    id: z.string().uuid().optional(),
    category_id: z.string().uuid(),
    name: z.string().max(100),
    type: z.enum(ITEM_TYPES),
    taxable: z.boolean(),
    status: z.enum(["active", "inactive"]).default("active"),
    price: z.number().min(0),
    um: z.string().max(5),
    cost: z.number().min(0),
    yield: z.number().min(0),
    is_transformed: z.boolean(),
});

export type Item = z.infer<typeof ItemSchema>

export const Item = {

    getItemsByType: async (brand_id: string, type: ItemType): Promise<Item[]> => {
        const query = "SELECT * FROM items WHERE brand_id = $1 AND type = $2"
        const values = [brand_id, type]

        const result = await db.query(query, values)
        return result.rows as Item[]
    },

    getItemById: async (id: string): Promise<Item> => {
        const query = "SELECT * FROM items WHERE id = $1"
        const values = [id]

        const result = await db.query(query, values);
        return result.rows[0] as Item
    },

    createItem: async (item: Item): Promise<Item> => {
        const query = `
            INSERT INTO items (name, type, category_id, taxable, price, um, cost, yield, is_tranformed) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *
        `
        const values = [item.name, item.type, item.category_id, item.taxable, item.price, item.um, item.cost, item.yield, item.is_transformed]

        const result = await db.query(query, values)
        return result.rows[0] as Item
    },

    updateItem: async (item: Item): Promise<Item> => {
        const query = `
            UPDATE items
            SET name = $2, category_id: $3, taxable: $4, price: $5, um = $6, cost = $7, yield = $8, is_transformed = $9, status = $10
            WHERE id = $1
            RETURNING * 
        `
        const values = [item.id, item.name, item.category_id, item.taxable, item.price, item.um, item.cost, item.yield, item.is_transformed, item.status]

        const result = await db.query(query, values)
        return result.rows[0] as Item
    }

}