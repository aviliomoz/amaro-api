import { Request, Response } from "express";
import { ApiResponse } from "../classes/response.class";
import { Brand } from "../models/brand.model";

export class BrandController {
    static async getBrandById(req: Request, res: Response) {
        const id = req.params.id as string

        try {
            const brand = await Brand.getBrandById(id)
            ApiResponse.send(res, 200, null, brand)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener la marca")
        }
    }

    static async getBrandBySlug(req: Request, res: Response) {
        const slug = req.params.slug as string

        try {
            const brand = await Brand.getBrandBySlug(slug)
            ApiResponse.send(res, 200, null, brand)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener la marca")
        }
    }

    static async getBrandsByUser(req: Request, res: Response) {
        const user_id = req.params.user_id as string

        try {
            const brands = await Brand.getBrandsByUser(user_id)
            ApiResponse.send(res, 200, null, brands)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener las marcas")
        }
    }
}