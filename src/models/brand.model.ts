import { z } from "zod";
import { db } from "../lib/database";

export const BrandSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(50),
    status: z.enum(["active", "inactive"]).default("active"),
    slug: z.string().max(20)
})

export type BrandType = z.infer<typeof BrandSchema>

export class Brand {

    static validate(data: BrandType) {
        return BrandSchema.parse(data)
    }

    static async getBrandById(id: string): Promise<BrandType> {
        const query = `SELECT * FROM brands WHERE id = $1`
        const values = [id]

        const result = await db.query(query, values)
        return result.rows[0] as BrandType
    }

    static async getBrandBySlug(slug: string): Promise<BrandType> {
        const query = `SELECT * FROM brands WHERE slug = $1`
        const values = [slug]

        const result = await db.query(query, values)
        return result.rows[0] as BrandType
    }

    static async getBrandsByUser(user_id: string): Promise<BrandType[]> {
        const query = `
            SELECT brands.* 
            FROM brands 
            INNER JOIN branches ON branches.brand_id = brands.id
            INNER JOIN branch_users AS bu ON bu.branch_id = branches.id
            WHERE bu.user_id = $1
        `

        const values = [user_id]

        const result = await db.query(query, values)
        return result.rows as BrandType[]
    }

}