import { z } from "zod"
import { db } from "../lib/database"
import { UserType } from "../utils/types"

export const BrandSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    status: z.enum(["active", "inactive"]).default("active"),
})

export type Brand = z.infer<typeof BrandSchema>

export const Brand = {

    getBrandsByUser: async (user_id: string): Promise<Brand[]> => {
        const query = "SELECT b.* FROM brands AS b INNER JOIN brand_users AS bu ON b.id = bu.brand_id AND bu.user_id = $1"
        const values = [user_id]

        const result = await db.query(query, values)
        return result.rows as Brand[]
    },

    addUserToBrand: async (user_id: string, brand_id: string, type: UserType): Promise<void> => {
        const query = "INSERT INTO brand_users (user_id, brand_id, type) VALUES ($1, $2, $3)"
        const values = [user_id, brand_id, type]

        await db.query(query, values)
    },

    removeUserFromBrand: async (user_id: string, brand_id: string): Promise<void> => {
        const query = "DELETE FROM brand_users WHERE user_id = $1 AND brand_id = $2"
        const values = [user_id, brand_id]

        await db.query(query, values)
    },

    updateUserInBrand: async (user_id: string, brand_id: string, role_id: string) => {
        const query = "UPDATE brand_users SET role_id = $3 WHERE user_id = $1 AND brand_id = $2"
        const values = [user_id, brand_id, role_id]

        await db.query(query, values)
    },

    createBrand: async (brand: Brand): Promise<Brand> => {
        const query = "INSERT INTO brands (name) VALUES ($1) RETURNING *"
        const values = [brand.name]

        const result = await db.query(query, values)
        return result.rows[0] as Brand
    },

    updateBrand: async (brand: Brand): Promise<Brand> => {
        const query = "UPTADE brands SET name = $2, status = $3 WHERE id = $1 RETURNING *"
        const values = [brand.id, brand.name, brand.status]

        const result = await db.query(query, values)
        return result.rows[0] as Brand
    },

    getBrandById: async (id: string): Promise<Brand> => {
        const query = "SELECT * FROM brands WHERE id = $1"
        const values = [id]

        const result = await db.query(query, values)
        return result.rows[0] as Brand
    }
} 