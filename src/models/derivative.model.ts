import { z } from "zod";
import { ItemType } from "./item.model";
import { db } from "../lib/database";

export const DerivativeSchema = z.object({
    item_id: z.string().uuid(),
    derivative_id: z.string().uuid()
})

export type DerivativeType = z.infer<typeof DerivativeSchema>

export class Derivative {

    static async getItemDerivatives(item_id: string): Promise<ItemType[]> {
        const query = `
            SELECT i.*
            FROM items AS i
            INNER JOIN derivatives AS d ON i.id = d.derivative_id 
            WHERE d.item_id = $1           
        `
        const params = [item_id]

        const result = await db.query(query, params)
        return result.rows as ItemType[]
    }

    static async addDerivative(item_id: string, derivative_id: string) {
        const query = `
            INSERT INTO derivatives (item_id, derivative_id)
            VALUES ($1, $2)
        `
        const params = [item_id, derivative_id]

        await db.query(query, params)
    }

    static async getDerivativeParentItem(derivative_id: string): Promise<ItemType> {
        const query = `
            SELECT i.*
            FROM items AS i
            INNER JOIN derivatives AS d ON i.id = d.item_id 
            WHERE d.derivative_id = $1
        `
        const params = [derivative_id]

        const result = await db.query(query, params)
        return result.rows[0] as ItemType
    }
}