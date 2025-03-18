import { z } from "zod";
import { ItemTypeEnum } from "../utils/types";
import { db } from "../lib/database";
import { ITEM_TYPES } from "../utils/constants";

export const CategorySchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    type: z.enum(ITEM_TYPES),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid(),
});

export type CategoryType = z.infer<typeof CategorySchema>

export class Category {

    static validate(data: CategoryType) {
        return CategorySchema.parse(data)
    }

    static async getCategoriesByType(brand_id: string, type: ItemTypeEnum): Promise<CategoryType[]> {
        const query = `
            SELECT * 
            FROM categories
            WHERE brand_id = $1 AND type = $2
            ORDER BY name
        `
        const values = [brand_id, type]

        const result = await db.query(query, values)
        return result.rows as CategoryType[]
    }

}