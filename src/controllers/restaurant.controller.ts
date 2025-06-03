import { Request, Response } from "express";
import { ApiResponse } from "../classes/response.class";
import { Restaurant } from "../models/restaurant.model";

export class RestaurantController {
    static async getRestaurantById(req: Request, res: Response) {
        const id = req.params.id as string

        try {
            const restaurant = await Restaurant.getRestaurantById(id)
            ApiResponse.send(res, 200, null, restaurant)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener la marca")
        }
    }

    static async getRestaurantBySlug(req: Request, res: Response) {
        const slug = req.params.slug as string

        try {
            const restaurant = await Restaurant.getRestaurantBySlug(slug)
            ApiResponse.send(res, 200, null, restaurant)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener la marca")
        }
    }

    static async getRestaurantsByUser(req: Request, res: Response) {
        const user_id = req.query.user_id as string

        try {
            const Restaurants = await Restaurant.getRestaurantsByUser(user_id)
            ApiResponse.send(res, 200, null, Restaurants)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener las marcas")
        }
    }
}