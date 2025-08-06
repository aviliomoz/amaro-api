import { z } from "zod";
import { db } from "../lib/database";

export const RestaurantSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(50),
    status: z.enum(["active", "inactive"]).default("active"),
    currency_code: z.string().max(3).default("PEN"),
    purchase_tax: z.number().min(0).max(100).default(0),
    sales_tax: z.number().min(0).max(100).default(0),
    slug: z.string().max(20),
    commissions: z.number().min(0).max(100).default(3),

    base_cost: z.number().min(0).default(32),
    rental_cost: z.number().min(0).default(10),
    labor_cost: z.number().min(0).default(20),
    service_cost: z.number().min(0).default(5), 
    marketing_cost: z.number().min(0).default(5),
    other_cost: z.number().min(0).default(5),
})

export type RestaurantType = z.infer<typeof RestaurantSchema>

export class Restaurant {
    static validate(data: RestaurantType) {
        return RestaurantSchema.parse(data)
    }

    static async getRestaurantsByUser(user_id: string): Promise<RestaurantType[]> {
        const query = `
            SELECT r.* 
            FROM restaurants AS r
            JOIN restaurant_users AS ru ON r.id = ru.restaurant_id
            WHERE ru.user_id = $1
            ORDER BY r.name
        `

        const result = await db.query(query, [user_id])
        return result.rows as RestaurantType[]
    }

    static async getRestaurantById(id: string): Promise<RestaurantType> {
        const query = `SELECT * FROM restaurants WHERE id = $1`
        const values = [id]

        const result = await db.query(query, values)
        return result.rows[0] as RestaurantType
    }

    static async getRestaurantBySlug(slug: string): Promise<RestaurantType> {
        const query = `
            SELECT * 
            FROM restaurants 
            WHERE slug = $1
        `
        const values = [slug]

        const result = await db.query(query, values)
        return result.rows[0] as RestaurantType
    }
}