import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { sendApiResponse } from "../classes/response.class";

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new Error("Token no enviado");
    }

    accessToken = accessToken.split(" ")[1];

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET!);

    if (!decodedToken) {
      throw new Error("Token inválido");
    }

    next();
  } catch (error) {
    return sendApiResponse(res, 401, error, null, "Error al validar la sesión");
  }
};
