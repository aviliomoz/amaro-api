import { Request, Response } from "express";
import { ItemType } from "../utils/types";
import { ApiResponse } from "../classes/response.class";
import { Item } from "../models/item.model";

export class ItemController {
    static async getItemsByType(req: Request, res: Response) {
        const branch_id = req.params.branch_id as string
        const type = req.query.type as ItemType

        try {
            const items = await Item.getItemsByType(branch_id, type)
            ApiResponse.send(res, 200, null, items)
        } catch (error) {
            ApiResponse.send(res, 500, error, "Error al obtener los ítems")
        }
    }
}