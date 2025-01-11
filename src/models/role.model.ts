import { z } from "zod";
import { db } from "../lib/database";

export const RoleSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(100),
    status: z.enum(["active", "inactive"]).default("active"),
    brand_id: z.string().uuid(),
});

export type Role = z.infer<typeof RoleSchema>

export const Role = {

    getRolesByBrand: async (brand_id: string): Promise<Role[]> => {
        const query = "SELECT * FROM roles WHERE brand_id = $1"
        const values = [brand_id]

        const result = await db.query(query, values)
        return result.rows as Role[]
    },

    getRoleById: async (id: string): Promise<Role> => {
        const query = "SELECT * FROM roles WHERE id = $1"
        const values = [id]

        const result = await db.query(query, values)
        return result.rows[0] as Role
    },

    createRole: async (role: Role): Promise<Role> => {
        const query = "INSERT INTO roles (name, brand_id) VALUES ($1, $2) RETURNING *"
        const values = [role.name, role.brand_id]

        const result = await db.query(query, values)
        return result.rows[0] as Role
    },

    updateRole: async (role: Role): Promise<Role> => {
        const query = "UPDATE roles SET name = $2, status = $3 WHERE id = $1"
        const values = [role.id, role.name, role.status]

        const result = await db.query(query, values)
        return result.rows[0] as Role
    }

}