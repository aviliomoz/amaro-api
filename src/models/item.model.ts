import { z } from "zod";
import { BASE_RECIPE_SUBTYPES, COMBO_SUBTYPES, ITEM_TYPES, PRODUCT_SUBTYPES, SUPPLY_SUBTYPES } from "../utils/constants";
import { db } from "../lib/database";

export const ItemSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    category_id: z.string().uuid(),
    type: z.enum(ITEM_TYPES),
    subtype: z.enum([...PRODUCT_SUBTYPES, ...COMBO_SUBTYPES, ...SUPPLY_SUBTYPES, ...BASE_RECIPE_SUBTYPES]),
    status: z.string(),
    um: z.enum(["kilogram", "liter", "unit", "ounze"]),
    taxable: z.boolean(),
    yiel: z.number().min(0),
    waste: z.number().min(0).max(100),
    brand_id: z.string().uuid(),
    discharge_type: z.enum(["recipe", "unit"]),
    stock_control: z.boolean()
})

export type ItemType = z.infer<typeof ItemSchema>
export type NewItemType = Omit<ItemType, "id">
export type FullItemType = ItemType & {
    category_name: string
    price: number,
    cost: number
}

export class Item {
    static validate(data: NewItemType) {
        return ItemSchema.omit({ id: true }).parse(data)
    }

    static async getItemsByType(branch_id: string, type: typeof ITEM_TYPES[number]): Promise<FullItemType[]> {
        const query = `
            SELECT i.*, c.name AS category_name, bi.price AS price, bi.cost AS cost
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
}