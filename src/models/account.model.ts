import { z } from "zod";
import { db } from "../lib/database";

export const AccountSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    password: z.string().max(255),
})

export type AccountType = z.infer<typeof AccountSchema>
export type NewAccountType = Omit<AccountType, "id">

export class Account {

    static async createAccount(account: NewAccountType): Promise<AccountType> {
        const query = "INSERT INTO accounts (user_id, password) VALUES ($1, $2) RETURNING *"
        const values = [account.user_id, account.password]

        const result = await db.query(query, values)
        return result.rows[0] as AccountType
    }

    static async getAccountByUserId(user_id: string): Promise<AccountType> {
        const query = "SELECT * FROM accounts WHERE user_id = $1 LIMIT 1"
        const values = [user_id]

        const result = await db.query(query, values)
        return result.rows[0] as AccountType
    }
}