import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendErrorResponse } from "../utils/responses";
import { AppError } from "../utils/errors";
import { verifyToken } from "../utils/tokens";
import { CustomRequest } from "../utils/types";
import { isValidObjectId } from "mongoose";

export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return sendErrorResponse(res, error, "Validation error");
    }
  };
};

export const validateId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    if (!id || !isValidObjectId(id)) {
      throw new AppError(400, "El ID está faltando o es inválido");
    }

    next();
  } catch (error) {
    sendErrorResponse(res, error, "No se pudo validar el ID de la consulta");
  }
};

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies.token;

  try {
    if (!token) throw new AppError(498, "Token not provided");

    const { error, token: decoded_token } = verifyToken(token);

    if (error) {
      res.clearCookie("token");
      throw new AppError(498, error);
    }

    if (decoded_token) {
      (req as CustomRequest).user = decoded_token.user;
      next();
    } else {
      throw new AppError(498, "Error validating token");
    }
  } catch (error) {
    return sendErrorResponse(res, error, "Error validating token");
  }
};
