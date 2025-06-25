import { Request, Response } from "express";
import { ApiResponse } from "../classes/response.class";
import { Category } from "../models/category.model";
import { ItemTypeEnum } from "../utils/types";

export class CategoryController {
    static async getCategories(req: Request, res: Response) {
        const restaurant_id = req.query.restaurant_id as string

        const type = req.query.type as ItemTypeEnum | undefined
        const status = req.query.status as "active" | "inactive" | undefined
        const search = req.query.search as string | undefined

        try {
            const categories = await Category.getCategories(restaurant_id, type, status, search)
            ApiResponse.send(res, 200, null, categories)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al cargar las categorías")
        }
    }

    static async createCategory(req: Request, res: Response) {
        const data = req.body

        try {
            const category = await Category.createCategory(data)
            ApiResponse.send(res, 201, null, category, "Categoría creada correctamente")
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al crear la categoría")
        }
    }

    static async updateCategory(req: Request, res: Response) {
        const id = req.params.id
        const data = req.body

        try {
            const category = await Category.updateCategory(id, data)
            ApiResponse.send(res, 200, null, category, "Categoría actualizada correctamente")
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al actualizar la categoría")
        }
    }
}