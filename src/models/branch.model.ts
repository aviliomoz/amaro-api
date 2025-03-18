import { z } from "zod";
import { db } from "../lib/database";

export const BranchSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(50),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid(),
    slug: z.string().max(20)
})

export type BranchType = z.infer<typeof BranchSchema>

export class Branch {
    static validate(data: BranchType) {
        return BranchSchema.parse(data)
    }

    static async getBranchById(id: string): Promise<BranchType> {
        const query = `SELECT * FROM branches WHERE id = $1`
        const values = [id]

        const result = await db.query(query, values)
        return result.rows[0] as BranchType
    }

    static async getBranchBySlug(brand_id: string, slug: string): Promise<BranchType> {
        const query = `
            SELECT branches.* 
            FROM branches 
            INNER JOIN brands ON brands.id = branches.brand_id
            WHERE brands.id = $1 AND branches.slug = $2
        `
        const values = [brand_id, slug]

        const result = await db.query(query, values)
        return result.rows[0] as BranchType
    }

    static async getBranchesByBrand(brand_id: string): Promise<BranchType[]> {
        const query = `SELECT * FROM branches WHERE brand_id = $1`
        const values = [brand_id]

        const result = await db.query(query, values)
        return result.rows as BranchType[]
    }
}