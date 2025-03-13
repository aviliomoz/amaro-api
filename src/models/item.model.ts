import { z } from "zod";
import { BASE_RECIPE_SUBTYPES, COMBO_SUBTYPES, ITEM_TYPES, PRODUCT_SUBTYPES, SUPPLY_SUBTYPES } from "../utils/constants";
import { db } from "../lib/database";

export const ItemSchema = z.object({
    id: z.string().uuid(),
    code: z.string().max(20).optional(),
    name: z.string(),
    category_id: z.string().uuid(),
    type: z.enum(ITEM_TYPES),
    subtype: z.enum([...PRODUCT_SUBTYPES, ...COMBO_SUBTYPES, ...SUPPLY_SUBTYPES, ...BASE_RECIPE_SUBTYPES]),
    status: z.string(),
    um: z.enum(["kilogram", "liter", "unit", "ounze"]),
    taxable: z.boolean(),
    yield: z.number().min(0),
    waste: z.number().min(0).max(100),
    brand_id: z.string().uuid(),
    discharge_type: z.enum(["recipe", "unit"]),
})

export type ItemType = z.infer<typeof ItemSchema>
export type NewItemType = Omit<ItemType, "id">
export type FullItemType = ItemType & {
    price: number,
    cost: number
}

export class Item {
    static validate(data: NewItemType) {
        return ItemSchema.omit({ id: true }).parse(data)
    }

    static async getItemsByType(branch_id: string, type: typeof ITEM_TYPES[number]): Promise<FullItemType[]> {
        const query = `
            SELECT i.*, bi.price AS price, bi.cost AS cost
            FROM items AS i
            INNER JOIN brands AS b ON b.id = i.brand_id
            INNER JOIN categories AS c ON c.id = i.category_id
            INNER JOIN branch_items AS bi ON bi.item_id = i.id 
            WHERE i.brand_id = b.id AND bi.branch_id = $1 AND i.type = $2
            ORDER BY i.name
        `

        const params = [branch_id, type]

        const result = await db.query(query, params)
        return result.rows as FullItemType[]
    }

    static async getItemById(id: string): Promise<FullItemType> {
        const query = `
            SELECT i.*, bi.price AS price, bi.cost AS cost
            FROM items AS i
            INNER JOIN brands AS b ON b.id = i.brand_id
            INNER JOIN categories AS c ON c.id = i.category_id
            INNER JOIN branch_items AS bi ON bi.item_id = i.id 
            WHERE i.id = $1
        `

        const params = [id]

        const result = await db.query(query, params)
        return result.rows[0] as FullItemType
    }

    static async createItem(data: FullItemType): Promise<FullItemType> {
        const item = Item.validate(data)

        const query = `
            INSERT INTO items (code, name, category_id, type, subtype, status, um, taxable, yield, waste, brand_id, discharge_type)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `

        const params = [
            item.code,
            item.name,
            item.category_id,
            item.type,
            item.subtype,
            item.status,
            item.um,
            item.taxable,
            item.yield,
            item.waste,
            item.brand_id,
            item.discharge_type,
        ]

        const result = await db.query(query, params)
        return result.rows[0] as FullItemType
    }

    static async addItemToBranch(branch_id: string, item_id: string, price: number, cost: number) {
        const query = `
            INSERT INTO branch_items (branch_id, item_id, price, cost)
            VALUES ($1, $2, $3, $4)
        `

        const params = [branch_id, item_id, price, cost]

        await db.query(query, params)
    }

    static async updateItem(id: string, data: FullItemType): Promise<FullItemType> {
        const item = Item.validate(data)

        const query = `
            UPDATE items
            SET code = $1, name = $2, category_id = $3, type = $4, subtype = $5, status = $6, um = $7, taxable = $8, yield = $9, waste = $10, brand_id = $11, discharge_type = $12
            WHERE id = $13
            RETURNING *
        `

        const params = [
            item.code,
            item.name,
            item.category_id,
            item.type,
            item.subtype,
            item.status,
            item.um,
            item.taxable,
            item.yield,
            item.waste,
            item.brand_id,
            item.discharge_type,
            id
        ]

        const result = await db.query(query, params)
        return result.rows[0] as FullItemType
    }

    static async updateItemOnBranch(branch_id: string, item_id: string, price: number, cost: number) {
        const query = `
            UPDATE branch_items
            SET price = $1, cost = $2
            WHERE branch_id = $3 AND item_id = $4
        `

        const params = [price, cost, branch_id, item_id]

        await db.query(query, params)
    }
}