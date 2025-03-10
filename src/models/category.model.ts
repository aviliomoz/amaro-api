import { z } from "zod";
import { ItemType } from "../utils/types";
import { db } from "../lib/database";
import { ITEM_TYPES } from "../utils/constants";

export const CategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().max(100),
    type: z.enum(ITEM_TYPES),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid(),
});

export type CategoryType = z.infer<typeof CategorySchema>
export type NewCategoryType = Omit<CategoryType, "id">

export class Category {

    static validate(data: NewCategoryType) {
        return CategorySchema.omit({ id: true }).parse(data)
    }

    static async getCategoriesByType(brand_id: string, type: ItemType): Promise<CategoryType[]> {
        const query = `
            SELECT * 
            FROM categories
            WHERE brand_id = $1 AND type = $2
        `
        const values = [brand_id, type]

        const result = await db.query(query, values)
        return result.rows as CategoryType[]
    }

}