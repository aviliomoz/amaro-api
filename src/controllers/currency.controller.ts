import { Request, Response } from "express";
import { sendApiResponse } from "../utils/responses";
import { Currency, CurrencySchema } from "../models/currency.model";

export const CurrencyController = {

  getCurrencies: async (req: Request, res: Response) => {
    try {
      const currencies = await Currency.getCurrencies();

      sendApiResponse(res, 200, null, currencies);
    } catch (error) {
      sendApiResponse(res, 500, error, null, "Error al obtener las monedas");
    }
  },

  getCurrencyByCode: async (req: Request, res: Response) => {
    try {
      const code = req.params.code as string;

      const currency = await Currency.getCurrencyByCode(code);

      sendApiResponse(res, 200, null, currency);
    } catch (error) {
      sendApiResponse(res, 500, error, null, "Error al obtener la moneda");
    }
  },

  createCurrency: async (req: Request, res: Response) => {
    try {
      const body = CurrencySchema.parse(req.body);

      const currency = await Currency.createCurrency(body);

      sendApiResponse(res, 201, null, currency);
    } catch (error) {
      sendApiResponse(res, 500, error, null, "Error al crear la moneda");
    }
  },

  updateCurrency: async (req: Request, res: Response) => {
    try {
      const body = CurrencySchema.parse(req.body);

      const currency = await Currency.updateCurrency(body);

      sendApiResponse(res, 200, null, currency);
    } catch (error) {
      sendApiResponse(res, 500, error, null, "Error al actualizar la moneda");
    }
  }
  
};
