import { Request, Response } from "express";
import { sendApiResponse } from "../utils/responses";
import { Brand } from "../models/brand.model";

export const BrandController = {
    getBrandById: async (req: Request, res: Response) => {
        const id = req.params.id as string

        try {
            const brand = await Brand.getBrandById(id)

            sendApiResponse(res, 200, null, brand)
        } catch (error) {
            sendApiResponse(res, 500, error, null, "Error al cargar la marca")
        }
    }
}