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

    static async getCategoriesByType(branch_id: string, type: ItemType): Promise<CategoryType[]> {
        const query = `
            SELECT c.* 
            FROM categories AS c
            INNER JOIN brands AS b ON b.id = c.brand_id
            INNER JOIN branches AS br ON b.id = br.brand_id 
            WHERE br.id = $1 AND c.type = $2
        `
        const values = [branch_id, type]

        const result = await db.query(query, values)
        return result.rows as CategoryType[]
    }

}