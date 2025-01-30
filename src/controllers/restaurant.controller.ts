import { Request, Response } from "express";
import { ApiResponse } from "../classes/response.class";
import { Restaurant } from "../models/restaurant.model";
import { addMonth } from "@formkit/tempo";
import { Currency } from "../models/currency.model";

export class RestaurantController {
    static async getRestaurantsByUser(req: Request, res: Response) {

        const userId = req.query.userId as string

        try {
            const restaurants = await Restaurant.getRestaurantsByUser(userId)

            ApiResponse.send(res, 200, null, restaurants)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener los restaurantes")
        }
    }

    static async getRestaurantById(req: Request, res: Response) {
        const id = req.params.id as string

        try {
            const branch = await Restaurant.getRestaurantById(id)

            ApiResponse.send(res, 200, null, branch)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener el restaurante")
        }
    }

    static setCurrentRestaurantId(req: Request, res: Response) {
        const id = req.params.id as string

        try {
            res.cookie("currentRestaurantId", id, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                secure: process.env.NODE_ENV === "production",
                expires: addMonth(new Date(), 1)
            })

            ApiResponse.send(res, 200, null, id)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al establecer el id del restaurante")
        }
    }

    static async getCurrentRestaurant(req: Request, res: Response) {
        const currentRestaurantId = req.cookies.currentRestaurantId as string

        try {
            const restaurant = await Restaurant.getRestaurantById(currentRestaurantId)
            const currency = await Currency.getCurrencyByCode(restaurant.currencyCode)
            ApiResponse.send(res, 200, null, { restaurant, currency })
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener el id del restaurante")
        }
    }
}