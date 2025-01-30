import { Request, Response } from "express";
import { ApiResponse } from "../classes/response.class";
import { Currency, CurrencySchema } from "../models/currency.model";

export class CurrencyController {

  static async getCurrencies(req: Request, res: Response) {
    try {
      const currencies = await Currency.getCurrencies();

      ApiResponse.send(res, 200, null, currencies);
    } catch (error) {
      ApiResponse.send(res, 500, error, null, "Error al obtener las monedas");
    }
  }

  static async getCurrencyByCode(req: Request, res: Response) {
    try {
      const code = req.params.code as string;

      const currency = await Currency.getCurrencyByCode(code);

      ApiResponse.send(res, 200, null, currency);
    } catch (error) {
      ApiResponse.send(res, 500, error, null, "Error al obtener la moneda");
    }
  }

  static async createCurrency(req: Request, res: Response) {
    try {
      const body = CurrencySchema.parse(req.body);

      const currency = await Currency.createCurrency(body);

      ApiResponse.send(res, 201, null, currency);
    } catch (error) {
      ApiResponse.send(res, 500, error, null, "Error al crear la moneda");
    }
  }

  static async updateCurrency(req: Request, res: Response) {
    try {
      const code = req.params.code as string
      const body = CurrencySchema.parse(req.body);

      const currency = await Currency.updateCurrency(code, body);

      ApiResponse.send(res, 200, null, currency);
    } catch (error) {
      ApiResponse.send(res, 500, error, null, "Error al actualizar la moneda");
    }
  }

};
