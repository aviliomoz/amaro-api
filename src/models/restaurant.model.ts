import { z } from "zod";
import { db } from "../lib/database";


export const RestaurantSchema = z.object({
    id: z.string().uuid(),
    name: z.string().max(100),
    currency_code: z.string().max(3),
    purchase_tax: z.number().min(0).max(100),
    sales_tax: z.number().min(0).max(100),
    status: z.enum(["active", "inactive"]).default("active")
});

export type Restaurant = z.infer<typeof RestaurantSchema>
export type NewRestaurant = Omit<Restaurant, "id">

export const Restaurant = {

    getRestaurantsByUser: async (userId: string): Promise<Restaurant[]> => {
        const query = `
            SELECT *
            FROM restaurants AS r
            INNER JOIN restaurant_users AS ru
            ON ru.restaurant_id = r.id
            WHERE ru.user_id = $1
        `
        const values = [userId]

        const result = await db.query(query, values)
        return result.rows as Restaurant[]
    },

    getRestaurantById: async (id: string): Promise<Restaurant> => {
        const query = "SELECT * FROM restaurants WHERE id = $1"
        const values = [id]

        const result = await db.query(query, values)
        return result.rows[0] as Restaurant
    },

    createRestaurant: async (restaurant: NewRestaurant): Promise<Restaurant> => {
        const query = `
            INSERT INTO restaurants (name, currency_code, purchase_tax, sales_tax) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `
        const values = [restaurant.name, restaurant.currency_code, restaurant.purchase_tax, restaurant.sales_tax]

        const result = await db.query(query, values)
        return result.rows[0] as Restaurant
    },

    updateRestaurant: async (restaurant: Restaurant): Promise<Restaurant> => {
        const query = `
            UPDATE restaurants
            SET name = $2, currency_code = $3, purchase_tax = $4, sales_tax = $5, status = $6 
            WHERE id = $1 
            RETURNING *
        `
        const values = [restaurant.id, restaurant.name, restaurant.currency_code, restaurant.purchase_tax, restaurant.sales_tax, restaurant.status]

        const result = await db.query(query, values)
        return result.rows[0] as Restaurant
    },

    addUserToRestaurant: async (user_id: string, restaurant_id: string, role_id: string, pin: string | null): Promise<void> => {
        const query = `
            INSERT INTO restaurant_users (user_id, branch_id, role_id, pin)
            VALUES ($1, $2, $3, $4)
        `
        const values = [user_id, restaurant_id, role_id, pin]

        await db.query(query, values)
    },

    removeUserFromRestaurant: async (user_id: string, restaurant_id: string): Promise<void> => {
        const query = `
            DELETE restaurant_users
            WHERE user_id = $1 AND branch_id = $2
        `
        const values = [user_id, restaurant_id]

        await db.query(query, values)
    },

    updateUserInRestaurant: async (user_id: string, restaurant_id: string, role_id: string, pin: string | null): Promise<void> => {
        const query = `
            UPDATE restaurant_users
            SET role_id = $3, pin = $4
            WHERE user_id = $1 AND branch_id = $2
        `
        const values = [user_id, restaurant_id, role_id, pin]

        await db.query(query, values)
    }

}