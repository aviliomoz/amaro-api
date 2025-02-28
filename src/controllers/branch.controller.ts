import { Request, Response } from "express";
import { ApiResponse } from "../classes/response.class";
import { Branch } from "../models/branch.model";

export class BranchController {
    static async getBranchById(req: Request, res: Response) {
        const id = req.params.id as string

        try {
            const branch = await Branch.getBranchById(id)
            ApiResponse.send(res, 200, null, branch)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener el local")
        }
    }

    static async getBranchesByBrand(req: Request, res: Response) {
        const brand_id = req.params.brand_id as string

        try {
            const branches = await Branch.getBranchesByBrand(brand_id)
            ApiResponse.send(res, 200, null, branches)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener los locales")
        }
    }
}