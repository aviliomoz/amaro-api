import { z } from "zod";
import { db } from "../lib/database";

export const BrandSchema = z.object({
    id: z.string().uuid(),
    name: z.string().max(50),
    status: z.enum(["active", "inactive"]).default("active"),
})

export type BrandType = z.infer<typeof BrandSchema>
export type NewBrandType = Omit<BrandType, "id">

export class Brand {

    static validate(data: NewBrandType) {
        return BrandSchema.omit({ id: true }).parse(data)
    }

    static async getBrandById(id: string): Promise<BrandType> {
        const query = `SELECT * FROM brands WHERE id = $1`
        const values = [id]

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