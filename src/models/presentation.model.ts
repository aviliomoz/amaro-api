import { z } from "zod";
import { db } from "../lib/database";

export const PresentationSchema = z.object({
    id: z.string().uuid().optional(),
    item_id: z.string().uuid(),
    name: z.string().max(100),
    amount: z.number().min(0),
    um: z.enum(["und", "kg", "lt", "oz"]),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type Presentation = z.infer<typeof PresentationSchema>

export const Presentation = {

    getPresentationsByItem: async (item_id: string): Promise<Presentation[]> => {
        const query = "SELECT * FROM presentations WHERE item_id = $1"
        const values = [item_id]

        const result = await db.query(query, values)
        return result.rows as Presentation[]
    },

    createPresentation: async (presentation: Presentation): Promise<Presentation> => {
        const query = "INSERT INTO presentations (name, item_id, amount, um) VALUES ($1, $2, $3, $4) RETURNING *"
        const values = [presentation.name, presentation.item_id, presentation.amount, presentation.um]

        const result = await db.query(query, values)
        return result.rows[0] as Presentation
    },

    updatePresentation: async (presentation: Presentation): Promise<Presentation> => {
        const query = "UPDATE presentations SET name = $2, amount = $3, um = $4, status = $5 WHERE id = $1 RETURNING *"
        const values = [presentation.id, presentation.name, presentation.amount, presentation.um, presentation.status]

        const result = await db.query(query, values)
        return result.rows[0] as Presentation
    }

}