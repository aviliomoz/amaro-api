import { z } from "zod";
import { ItemTypeEnum } from "../utils/types";
import { db } from "../lib/database";
import { ITEM_TYPES } from "../utils/constants";

export const CategorySchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    type: z.enum(ITEM_TYPES),
    status: z.enum(["active", "inactive"]).default("active"),
    restaurant_id: z.string().uuid(),
});

export type CategoryType = z.infer<typeof CategorySchema>

export class Category {

    static validate(data: CategoryType) {
        return CategorySchema.parse(data)
    }

    static async getCategories(restaurant_id: string, type?: ItemTypeEnum, status?: "active" | "inactive", search?: string): Promise<CategoryType[]> {
        let query = `
            SELECT * 
            FROM categories
            WHERE restaurant_id = $1
        `
        let values = [restaurant_id]

        if (type) {
            const index = values.length + 1
            query += ` AND type = $${index}`
            values.push(type)
        }

        if (status) {
            const index = values.length + 1
            query += ` AND status = $${index}`
            values.push(status)
        }

        if (search) {
            const index = values.length + 1
            query += ` AND name ILIKE '%' || $${index} || '%'`
            values.push(search)
        }

        query += ` ORDER BY name`

        const result = await db.query(query, values)
        return result.rows as CategoryType[]
    }

    static async createCategory(data: CategoryType): Promise<CategoryType> {
        const validatedData = this.validate(data);
        const query = `
            INSERT INTO categories (name, type, status, restaurant_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [validatedData.name, validatedData.type, validatedData.status, validatedData.restaurant_id];
        const result = await db.query(query, values);
        return result.rows[0] as CategoryType;
    }

    static async updateCategory(id: string, data: CategoryType): Promise<CategoryType> {
        const validatedData = this.validate(data);
        const query = `
            UPDATE categories
            SET name = $1, type = $2, status = $3
            WHERE id = $4
            RETURNING *
        `;
        const values = [validatedData.name, validatedData.type, validatedData.status, id];
        const result = await db.query(query, values);
        return result.rows[0] as CategoryType;
    }

}