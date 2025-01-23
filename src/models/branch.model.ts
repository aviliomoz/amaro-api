import { z } from "zod";
import { db } from "../lib/database";


export const BranchSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    currency_code: z.string().max(3),
    purchase_tax: z.number().min(0).max(100),
    sales_tax: z.number().min(0).max(100),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid(),
});

export type Branch = z.infer<typeof BranchSchema>

export type BranchWithBrandName = Branch & {
    brand_name: string
}

export const Branch = {

    getBranchesByUser: async (userId: string): Promise<BranchWithBrandName[]> => {
        const query = `
            SELECT branches.*, brands.name AS brand_name
            FROM branches
            INNER JOIN brands
            ON branches.brand_id = brands.id
            INNER JOIN branch_users AS bu
            ON bu.branch_id = branches.id
            WHERE bu.user_id = $1
        `
        const values = [userId]

        const result = await db.query(query, values)
        return result.rows as BranchWithBrandName[]
    },

    getBranchesByBrand: async (brand_id: string): Promise<Branch[]> => {
        const query = "SELECT * FROM branches WHERE brand_id = $1"
        const values = [brand_id]

        const result = await db.query(query, values)
        return result.rows as Branch[]
    },

    getBranchById: async (id: string): Promise<Branch> => {
        const query = "SELECT * FROM branches WHERE id = $1"
        const values = [id]

        const result = await db.query(query, values)
        return result.rows[0] as Branch
    },

    createBranch: async (branch: Branch): Promise<Branch> => {
        const query = `
            INSERT INTO branches (name, currency_code, purchase_tax, sales_tax, brand_id) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `
        const values = [branch.name, branch.currency_code, branch.purchase_tax, branch.sales_tax, branch.brand_id]

        const result = await db.query(query, values)
        return result.rows[0] as Branch
    },

    updateBranch: async (branch: Branch): Promise<Branch> => {
        const query = `
            UPDATE branches 
            SET name = $2, currency_code = $3, purchase_tax = $4, sales_tax = $5, status = $6 
            WHERE id = $1 
            RETURNING *
        `
        const values = [branch.id, branch.name, branch.currency_code, branch.purchase_tax, branch.sales_tax, branch.status]

        const result = await db.query(query, values)
        return result.rows[0] as Branch
    },

    addUserToBranch: async (user_id: string, branch_id: string, role_id: string, pin: string | null): Promise<void> => {
        const query = `
            INSERT INTO branch_users (user_id, branch_id, role_id, pin)
            VALUES ($1, $2, $3, $4)
        `
        const values = [user_id, branch_id, role_id, pin]

        await db.query(query, values)
    },

    removeUserFromBranch: async (user_id: string, branch_id: string): Promise<void> => {
        const query = `
            DELETE branch_users
            WHERE user_id = $1 AND branch_id = $2
        `
        const values = [user_id, branch_id]

        await db.query(query, values)
    },

    updateUserInBranch: async (user_id: string, branch_id: string, role_id: string, pin: string | null): Promise<void> => {
        const query = `
            UPDATE branch_users
            SET role_id = $3, pin = $4
            WHERE user_id = $1 AND branch_id = $2
        `
        const values = [user_id, branch_id, role_id, pin]

        await db.query(query, values)
    }

}