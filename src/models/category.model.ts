import { z } from "zod";
import { ItemType } from "../utils/types";
import { db } from "../lib/database";
import { ITEM_TYPES } from "../utils/constants";

export const CategorySchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    type: z.enum(ITEM_TYPES),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid(),
});

export type Category = z.infer<typeof CategorySchema>

export const Category = {

    getCategoriesByType: async (brand_id: string, type: ItemType): Promise<Category[]> => {
        const query = "SELECT * FROM categories WHERE brand_id = $1 AND type = $2"
        const values = [brand_id, type]

        const result = await db.query(query, values)
        return result.rows as Category[]
    },

    getCategoryById: async (id: string): Promise<Category> => {
        const query = "SELECT * FROM categories WHERE id = $1"
        const values = [id]

        const result = await db.query(query, values)
        return result.rows[0] as Category
    },

    getCategoriesByBrand: async (brand_id: string): Promise<Category[]> => {
        const query = "SELECT * FROM categories WHERE brand_id = $1"
        const values = [brand_id]

        const result = await db.query(query, values)
        return result.rows as Category[]
    },

    createCategory: async (category: Category): Promise<Category> => {
        const query = "INSERT INTO categories (name, type, brand_id) VALUES ($1, $2, $3) RETURNING *"
        const values = [category.name, category.type, category.brand_id]

        const result = await db.query(query, values)
        return result.rows[0] as Category
    },

    updateCategory: async (category: Category): Promise<Category> => {
        const query = "UPDATE categories SET name = $2, type = $3, status = $4 WHERE id = $1 RETURNING *"
        const values = [category.id, category.name, category.type, category.status]

        const result = await db.query(query, values)
        return result.rows[0] as Category
    }

}