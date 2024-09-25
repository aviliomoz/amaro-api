import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";
import { Currency, CurrencySchema } from "../models/currency.model";

const getCurrencies = async (req: Request, res: Response) => {
  try {
    const currencies = await Currency.getCurrencies();

    if (!currencies) throw new Error("No se pudieron obtener las monedas");

    return sendSuccessResponse(res, 200, "Monedas disponibles", currencies);
  } catch (error) {
    sendErrorResponse(res, error, "Error al obtener las monedas");
  }
};

const getCurrencyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const currency = await Currency.getCurrencyById(id);

    if (!currency) throw new Error("No se encontró la moneda");

    return sendSuccessResponse(res, 200, "Moneda encontrada", currency);
  } catch (error) {
    sendErrorResponse(res, error, "Error al obtener la moneda");
  }
};

const createCurrency = async (req: Request, res: Response) => {
  try {
    const data = CurrencySchema.parse(req.body);

    const currency = await Currency.createCurrency(data);

    if (!currency) throw new Error("No se pudo crear la moneda");

    return sendSuccessResponse(res, 201, "Moneda creada", currency);
  } catch (error) {
    sendErrorResponse(res, error, "Error al crear la moneda");
  }
};

const updateCurrency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = CurrencySchema.partial().parse(req.body);

    const currency = await Currency.updateCurrency(id, data);

    if (!currency) throw new Error("No se pudo actualizar la moneda");

    return sendSuccessResponse(res, 200, "Moneda actualizada", currency);
  } catch (error) {
    sendErrorResponse(res, error, "Error al actualizar la moneda");
  }
};

export const CurrencyController = {
  getCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
};
