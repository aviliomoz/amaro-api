import { z } from "zod";
import { ItemType } from "../utils/types";
import { db } from "../lib/database";
import { ITEM_TYPES } from "../utils/constants";

export const CategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().max(100),
    type: z.enum(ITEM_TYPES),
    status: z.enum(["active", "inactive"]).default("active"),
    restaurantId: z.string().uuid(),
});

export type CategoryType = z.infer<typeof CategorySchema>
export type NewCategoryType = Omit<CategoryType, "id">

export class Category {

    static validate(data: NewCategoryType) {
        return CategorySchema.omit({ id: true }).parse(data)
    }

    static async getCategoriesByType(restaurantId: string, type: ItemType): Promise<CategoryType[]> {
        const query = "SELECT * FROM categories WHERE restaurant_id = $1 AND type = $2"
        const values = [restaurantId, type]

        const result = await db.query(query, values)
        return result.rows as CategoryType[]
    }

    static async getCategoryById(id: string): Promise<CategoryType> {
        const query = "SELECT * FROM categories WHERE id = $1"
        const values = [id]

        const result = await db.query(query, values)
        return result.rows[0] as CategoryType
    }

    static async getCategoriesByRestaurant(restaurantId: string): Promise<CategoryType[]> {
        const query = "SELECT * FROM categories WHERE restaurant_id = $1"
        const values = [restaurantId]

        const result = await db.query(query, values)
        return result.rows as CategoryType[]
    }

    static async createCategory(category: NewCategoryType): Promise<CategoryType> {
        const query = "INSERT INTO categories (name, type, restaurant_id) VALUES ($1, $2, $3) RETURNING *"
        const values = [category.name, category.type, category.restaurantId]

        const result = await db.query(query, values)
        return result.rows[0] as CategoryType
    }

    static async updateCategory(id: string, category: NewCategoryType): Promise<CategoryType> {
        const query = "UPDATE categories SET name = $2, type = $3, status = $4 WHERE id = $1 RETURNING *"
        const values = [id, category.name, category.type, category.status]

        const result = await db.query(query, values)
        return result.rows[0] as CategoryType
    }

}