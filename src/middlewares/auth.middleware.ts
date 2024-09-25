import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendErrorResponse } from "../utils/responses";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      throw new Error("Token no enviado");
    }

    token = token.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decodedToken) {
      throw new Error("Token inválido");
    }

    next();
  } catch (error) {
    return sendErrorResponse(res, error, "Error al validar el token");
  }
};
