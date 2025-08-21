import { z } from "zod";
import { RestaurantType } from "./restaurant.model";
import { db } from "../lib/database";

export const DeviceSchema = z.object({
    id: z.string().uuid().optional(),
    restaurant_id: z.string().uuid(),
    device_code: z.string().length(10),
    role: z.enum(["cashier", "waiter", "production"]).default("production"),
})

export type DeviceType = z.infer<typeof DeviceSchema>

export class Device {

    static async getDeviceByCode(deviceCode: string): Promise<DeviceType | null> {
        const query = `
            SELECT * FROM devices WHERE device_code = $1
        `;
        const params = [deviceCode];
        const result = await db.query(query, params);
        return result.rows[0] || null;
    }

    static async getVinculatedRestaurants(deviceCode: string): Promise<RestaurantType[]> {
        const query = `
            SELECT r.*
            FROM devices AS d
            INNER JOIN restaurants AS r ON d.restaurant_id = r.id
            WHERE d.device_code = $1
        `;
        const params = [deviceCode];

        const result = await db.query(query, params);
        return result.rows as RestaurantType[];
    }
}