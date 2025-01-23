import { Request, Response } from "express";
import { sendApiResponse } from "../utils/responses";
import { Branch } from "../models/branch.model";
import { addMonth } from "@formkit/tempo";
import { Brand } from "../models/brand.model";
import { Currency } from "../models/currency.model";

export const BranchController = {
    getBranchesByUser: async (req: Request, res: Response) => {

        const userId = req.query.userId as string

        try {
            const branches = await Branch.getBranchesByUser(userId)

            sendApiResponse(res, 200, null, branches)
        } catch (error) {
            sendApiResponse(res, 500, error, null, "Error al obtener los restaurantes")
        }
    },

    getBranchById: async (req: Request, res: Response) => {
        const id = req.params.id as string

        try {
            const branch = await Branch.getBranchById(id)

            sendApiResponse(res, 200, null, branch)
        } catch (error) {
            sendApiResponse(res, 500, error, null, "Error al obtener el restaurante")
        }
    },

    setCurrentBranchId: (req: Request, res: Response) => {
        const id = req.params.id as string

        try {
            res.cookie("currentBranchId", id, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                secure: process.env.NODE_ENV === "production",
                expires: addMonth(new Date(), 1)
            })

            sendApiResponse(res, 200, null, id)
        } catch (error) {
            sendApiResponse(res, 500, error, null, "Error al establecer el id del restaurante")
        }
    },

    getCurrentBranch: async (req: Request, res: Response) => {
        const currentBranchId = req.cookies.currentBranchId as string

        try {
            const branch = await Branch.getBranchById(currentBranchId)
            const brand = await Brand.getBrandById(branch.brand_id)
            const currency = await Currency.getCurrencyByCode(branch.currency_code)
            sendApiResponse(res, 200, null, { branch, brand, currency })
        } catch (error) {
            sendApiResponse(res, 500, error, null, "Error al obtener el id del restaurante")
        }
    }
}