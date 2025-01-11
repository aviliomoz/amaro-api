import { z } from "zod";
import { db } from "../lib/database";

export const EquivalenceSchema = z.object({
    id: z.string().uuid().optional(),
    item_id: z.string().uuid(),
    um: z.string().max(5),
    amount: z.number().min(0),
});

export type Equivalence = z.infer<typeof EquivalenceSchema>

export const Equivalence = {

    getEquivalencesByItem: async (item_id: string): Promise<Equivalence[]> => {
        const query = "SELECT * FROM equivalences WHERE item_id = $1"
        const values = [item_id]

        const result = await db.query(query, values)
        return result.rows as Equivalence[]
    },

    createEquivalence: async (equivalence: Equivalence): Promise<Equivalence> => {
        const query = "INSERT INTO equivalences (item_id, amount, um) VALUES ($1, $2, $3) RETURNING *"
        const values = [equivalence.item_id, equivalence.amount, equivalence.um]

        const result = await db.query(query, values)
        return result.rows[0] as Equivalence
    },

    updateEquivalence: async (equivalence: Equivalence): Promise<Equivalence> => {
        const query = "UPDATE equivalences SET amount = $2, um = $3 WHERE id = $1 RETURNING *"
        const values = [equivalence.id, equivalence.amount, equivalence.um]

        const result = await db.query(query, values)
        return result.rows[0] as Equivalence
    }

}