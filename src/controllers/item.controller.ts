import { Request, Response } from "express";
import { ItemType } from "../utils/types";
import { ApiResponse } from "../classes/response.class";
import { Item, NewItemType, ItemType as I, FullItemType } from "../models/item.model";

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

    static async getItemById(req: Request, res: Response) {
        const id = req.params.id as string

        try {
            const item = await Item.getItemById(id)
            ApiResponse.send(res, 200, null, item)
        } catch (error) {
            ApiResponse.send(res, 500, error, "Error al obtener el ítem")
        }
    }

    static async createItem(req: Request, res: Response) {
        const data = req.body as NewItemType
        const branch_id = req.params.branch_id as string

        try {
            const item = await Item.createItem(data)
            await Item.addItemToBranch(item.id, branch_id, item.price, item.cost)
            ApiResponse.send(res, 201, null, item)
        } catch (error) {
            ApiResponse.send(res, 500, error, "Error al crear el ítem")
        }
    }

    static async updateItem(req: Request, res: Response) {
        const id = req.params.id as string
        const branch_id = req.params.branch_id as string
        const data = req.body as FullItemType

        try {
            const item = await Item.updateItem(id, data)
            await Item.updateItemOnBranch(branch_id, id, data.price, data.cost)
            ApiResponse.send(res, 200, null, item)
        } catch (error) {
            ApiResponse.send(res, 500, error, "Error al actualizar el ítem")
        }
    }
}