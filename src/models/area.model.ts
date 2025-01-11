import { z } from "zod";
import { db } from "../lib/database";

export const AreaSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    type: z.enum(["production", "storage"]),
    status: z.enum(["active", "inactive"]).default("active"),
    branch_id: z.string().uuid(),
});

export type Area = z.infer<typeof AreaSchema>

export const Area = {

    getAreasByBranch: async (branch_id: string): Promise<Area[]> => {
        const query = "SELECT * FROM areas WHERE branch_id = $1"
        const values = [branch_id]

        const result = await db.query(query, values)
        return result.rows as Area[]
    },

    getAreaById: async (id: string): Promise<Area> => {
        const query = "SELECT * FROM areas WHERE id = $1"
        const values = [id]

        const result = await db.query(query, values)
        return result.rows[0] as Area
    },

    createArea: async (area: Area): Promise<Area> => {
        const query = "INSERT INTO areas (name, type, branch_id) VALUES ($1, $2, $3) RETURNING *"
        const values = [area.name, area.type, area.branch_id]

        const result = await db.query(query, values)
        return result.rows[0] as Area
    },

    updateArea: async (area: Area): Promise<Area> => {
        const query = "UPDATE areas SET name = $2, type = $3, status = $4 WHERE id = $1 RETURNING *"
        const values = [area.id, area.name, area.type, area.status]

        const result = await db.query(query, values)
        return result.rows[0] as Area
    }

}