import { z } from "zod";
import { db } from "../lib/database";


export const RestaurantSchema = z.object({
    id: z.string().uuid(),
    name: z.string().max(100),
    currencyCode: z.string().max(3),
    purchaseTax: z.number().min(0).max(100),
    salesTax: z.number().min(0).max(100),
    status: z.enum(["active", "inactive"]).default("active")
});

export type RestaurantType = z.infer<typeof RestaurantSchema>
export type NewRestaurantType = Omit<RestaurantType, "id">

export class Restaurant {

    static validate(data: NewRestaurantType) {
        return RestaurantSchema.omit({ id: true }).parse(data)
    }

    static async getRestaurantsByUser(userId: string): Promise<RestaurantType[]> {
        const query = `
            SELECT *
            FROM restaurants AS r
            INNER JOIN restaurant_users AS ru
            ON ru.restaurant_id = r.id
            WHERE ru.user_id = $1
        `
        const values = [userId]

        const result = await db.query(query, values)
        return result.rows as RestaurantType[]
    }

    static async getRestaurantById(id: string): Promise<RestaurantType> {
        const query = "SELECT * FROM restaurants WHERE id = $1"
        const values = [id]

        const result = await db.query(query, values)
        return result.rows[0] as RestaurantType
    }

    static async createRestaurant(restaurant: NewRestaurantType): Promise<RestaurantType> {
        const query = `
            INSERT INTO restaurants (name, currency_code, purchase_tax, sales_tax) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `
        const values = [restaurant.name, restaurant.currencyCode, restaurant.purchaseTax, restaurant.salesTax]

        const result = await db.query(query, values)
        return result.rows[0] as RestaurantType
    }

    static async updateRestaurant(id: string, restaurant: NewRestaurantType): Promise<RestaurantType> {
        const query = `
            UPDATE restaurants
            SET name = $2, currency_code = $3, purchase_tax = $4, sales_tax = $5, status = $6 
            WHERE id = $1 
            RETURNING *
        `
        const values = [id, restaurant.name, restaurant.currencyCode, restaurant.purchaseTax, restaurant.salesTax, restaurant.status]

        const result = await db.query(query, values)
        return result.rows[0] as RestaurantType
    }

    static async addUserToRestaurant(userId: string, restaurantId: string, roleId: string, pin: string | null): Promise<void> {
        const query = `
            INSERT INTO restaurant_users (user_id, branch_id, role_id, pin)
            VALUES ($1, $2, $3, $4)
        `
        const values = [userId, restaurantId, roleId, pin]

        await db.query(query, values)
    }

    static async removeUserFromRestaurant(userId: string, restaurantId: string): Promise<void> {
        const query = `
            DELETE restaurant_users
            WHERE user_id = $1 AND branch_id = $2
        `
        const values = [userId, restaurantId]

        await db.query(query, values)
    }

    static async updateUserInRestaurant(userId: string, restaurantId: string, roleId: string, pin: string | null): Promise<void> {
        const query = `
            UPDATE restaurant_users
            SET role_id = $3, pin = $4
            WHERE user_id = $1 AND branch_id = $2
        `
        const values = [userId, restaurantId, roleId, pin]

        await db.query(query, values)
    }

}