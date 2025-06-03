import { Request, Response } from "express"
import { Derivative } from "../models/derivative.model"
import { ApiResponse } from "../classes/response.class"
import { Item, ItemType } from "../models/item.model"

export class DerivativeController {
    static async getItemDerivatives(req: Request, res: Response) {
        const item_id = req.params.item_id as string

        try {
            const derivatives = await Derivative.getItemDerivatives(item_id)
            ApiResponse.send(res, 200, null, derivatives)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener los derivados")
        }
    }

    static async updateDerivatives(req: Request, res: Response) {
        const item_id = req.params.item_id as string
        const derivatives = req.body as ItemType[]

        try {
            const currentDerivatives = await Derivative.getItemDerivatives(item_id)

            // Add or update derivatives
            derivatives.forEach(async (derivative) => {
                const found = currentDerivatives.find((i) => i.id === derivative.id)

                if (found) {
                    await Item.updateItem(derivative.id!, derivative)
                } else {
                    const newDerivative = await Item.createItem(derivative)
                    await Derivative.addDerivative(item_id, newDerivative.id!)
                }
            })

            ApiResponse.send(res, 200, null, null, "Derivados actualizados")
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al actualizar los derivados")
        }
    }

}