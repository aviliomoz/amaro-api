import { z } from "zod";
import { db } from "../lib/database";

export const BranchSchema = z.object({
    id: z.string().uuid(),
    name: z.string().max(50),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid(),
    type: z.enum(["sales", "production"]).default("sales")
})

export type BranchType = z.infer<typeof BranchSchema>
export type NewBranchType = Omit<BranchType, "id">

export class Branch {
    static validate(data: NewBranchType) {
        return BranchSchema.omit({ id: true }).parse(data)
    }

    static async getBranchById(id: string): Promise<BranchType> {
        const query = `SELECT * FROM branches WHERE id = $1`
        const values = [id]

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