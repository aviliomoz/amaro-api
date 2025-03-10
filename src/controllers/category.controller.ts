import { Request, Response } from "express";
import { ApiResponse } from "../classes/response.class";
import { Category } from "../models/category.model";
import { ItemType } from "../utils/types";

export class CategoryController {
    static async getCategoriesByType(req: Request, res: Response) {
        const brand_id = req.params.brand_id as string
        const type = req.params.type as ItemType

        try {
            const categories = await Category.getCategoriesByType(brand_id, type)
            ApiResponse.send(res, 200, null, categories)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al cargar las categorías")
        }
    }
}