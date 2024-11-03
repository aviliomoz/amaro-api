import { z } from "zod";

export const TableSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().max(5),
    hall_id: z.string().uuid(),
    status: z.enum(["active", "inactive"]).default("active"),
});

export type Table = z.infer<typeof TableSchema>

export const Table = {

}