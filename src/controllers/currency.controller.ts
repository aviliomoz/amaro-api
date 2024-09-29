import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";
import { Currency, CurrencySchema } from "../models/currency.model";

const getCurrencies = async (req: Request, res: Response) => {
  try {
    const { data, error } = await Currency.getCurrencies();

    if (error) throw new Error("No se encontraror monedas");

    return sendSuccessResponse(res, 200, "Monedas disponibles", data || []);
  } catch (error) {
    sendErrorResponse(res, error, "Error al obtener las monedas");
  }
};

const getCurrencyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await Currency.getCurrencyById(id);

    if (error || !data) throw new Error("No se encontró la moneda");

    return sendSuccessResponse(res, 200, "Moneda encontrada", data!);
  } catch (error) {
    sendErrorResponse(res, error, "Error al obtener la moneda");
  }
};

const createCurrency = async (req: Request, res: Response) => {
  try {
    const body = CurrencySchema.parse(req.body);

    const { data, error } = await Currency.createCurrency(body);

    if (error || !data) throw new Error("No se pudo crear la moneda");

    return sendSuccessResponse(res, 201, "Moneda creada", data!);
  } catch (error) {
    sendErrorResponse(res, error, "Error al crear la moneda");
  }
};

const updateCurrency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = CurrencySchema.parse(req.body);

    const { data, error } = await Currency.updateCurrency(id, body);

    if (error || !data) throw new Error("No se pudo actualizar la moneda");

    return sendSuccessResponse(res, 200, "Moneda actualizada", data!);
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
