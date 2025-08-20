import { Request, Response } from "express";
import { Device } from "../models/device.model";
import { ApiResponse } from "../classes/response.class";

export class DeviceController {
    static async getVinculatedRestaurants(req: Request, res: Response) {
        const deviceCode = req.params.device_code as string;

        try {
            const restaurants = await Device.getVinculatedRestaurants(deviceCode);
            ApiResponse.send(res, 200, null, restaurants);
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener los restaurantes vinculados");
        }
    }
}