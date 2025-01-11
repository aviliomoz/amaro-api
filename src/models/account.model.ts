import { z } from "zod";
import { db } from "../lib/database";

export const AccountSchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid(),
    password: z.string().max(255),
})

export type Account = z.infer<typeof AccountSchema>

export const Account = {

    createAccount: async (userId: string, password: string): Promise<Account> => {
        const query = "INSERT INTO accounts (user_id, password) VALUES ($1, $2) RETURNING *"
        const values = [userId, password]

        const result = await db.query(query, values)
        return result.rows[0] as Account
    },

    getAccountByUserId: async (userId: string): Promise<Account> => {
        const query = "SELECT * FROM accounts WHERE user_id = $1 LIMIT 1"
        const values = [userId]

        const result = await db.query(query, values)
        return result.rows[0] as Account
    }
}