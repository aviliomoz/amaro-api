import { Request, Response } from "express";
import { ItemSubtypeEnum, ItemTypeEnum } from "../utils/types";
import { ApiResponse } from "../classes/response.class";
import { Item, ItemType } from "../models/item.model";

export class ItemController {
    static async getItems(req: Request, res: Response) {
        const restaurant_id = req.query.restaurant_id as string
        const type = req.query.type as ItemTypeEnum

        const subtype = req.query.subtype as ItemSubtypeEnum;
        const search = req.query.search as string;
        const category_id = req.query.category_id as string;
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const status = req.query.status as "active" | "inactive" | undefined;

        try {
            const items = await Item.getItems(restaurant_id, type, subtype, search, category_id, page, status)
            ApiResponse.send(res, 200, null, items)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener los ítems")
        }
    }

    static async getItemById(req: Request, res: Response) {
        const id = req.params.id as string

        try {
            const item = await Item.getItemById(id)
            ApiResponse.send(res, 200, null, item)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener el ítem")
        }
    }

    static async createItem(req: Request, res: Response) {
        const data = req.body as ItemType

        try {

            const items = await Item.getItems(data.restaurant_id, data.type)
            const found = items.find((item) => item.name === data.name)

            if (found) {
                return ApiResponse.send(res, 400, null, null, "Ya existe un ítem con ese nombre")
            } else {
                const item = await Item.createItem(data)
                ApiResponse.send(res, 201, null, item)
            }

        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al crear el ítem")
        }
    }

    static async updateItem(req: Request, res: Response) {
        const id = req.params.id as string
        const data = req.body as ItemType

        try {

            const items = await Item.getItems(data.restaurant_id, data.type)
            const currentItem = await Item.getItemById(id)
            const found = items.filter(item => item.name !== currentItem.name).find((item) => item.name === data.name)

            if (found) {
                return ApiResponse.send(res, 400, null, null, "Ya existe un ítem con ese nombre")
            } else {
                const item = await Item.updateItem(id, data)
                ApiResponse.send(res, 200, null, item)
            }

        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al actualizar el ítem")
        }
    }

    static async searchItems(req: Request, res: Response) {
        const restaurant_id = req.query.restaurant_id as string
        const search = req.query.search as string
        const type = req.query.type as ItemTypeEnum

        try {
            const items = await Item.searchItems(restaurant_id, search, type)
            ApiResponse.send(res, 200, null, items)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al buscar los ítems")
        }
    }
}