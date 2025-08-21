import { Request, Response } from "express";
import { Device } from "../models/device.model";
import { ApiResponse } from "../classes/response.class";

export class DeviceController {

    static async getDeviceByCode(req: Request, res: Response) {
        const deviceCode = req.params.deviceCode as string;

        try {
            const device = await Device.getDeviceByCode(deviceCode);
            if (!device) {
                return ApiResponse.send(res, 404, null, null, "Dispositivo no encontrado");
            }
            ApiResponse.send(res, 200, null, device);
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener el dispositivo");
        }
    }

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