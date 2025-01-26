import { Request, Response } from "express";
import { sendApiResponse } from "../utils/responses";
import { Restaurant } from "../models/restaurant.model";
import { addMonth } from "@formkit/tempo";
import { Currency } from "../models/currency.model";

export const RestaurantController = {
    getRestaurantsByUser: async (req: Request, res: Response) => {

        const userId = req.query.userId as string

        try {
            const restaurants = await Restaurant.getRestaurantsByUser(userId)

            sendApiResponse(res, 200, null, restaurants)
        } catch (error) {
            sendApiResponse(res, 500, error, null, "Error al obtener los restaurantes")
        }
    },

    getRestaurantById: async (req: Request, res: Response) => {
        const id = req.params.id as string

        try {
            const branch = await Restaurant.getRestaurantById(id)

            sendApiResponse(res, 200, null, branch)
        } catch (error) {
            sendApiResponse(res, 500, error, null, "Error al obtener el restaurante")
        }
    },

    setCurrentRestaurantId: (req: Request, res: Response) => {
        const id = req.params.id as string

        try {
            res.cookie("currentRestaurantId", id, {
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

    getCurrentRestaurant: async (req: Request, res: Response) => {
        const currentRestaurantId = req.cookies.currentRestaurantId as string

        try {
            const restaurant = await Restaurant.getRestaurantById(currentRestaurantId)
            const currency = await Currency.getCurrencyByCode(restaurant.currency_code)
            sendApiResponse(res, 200, null, { restaurant, currency })
        } catch (error) {
            sendApiResponse(res, 500, error, null, "Error al obtener el id del restaurante")
        }
    }
}