import { Request, Response } from "express";
import { User } from "../models/user.model";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.getUserById(id);

    if (!user) throw new Error("No se encontró el usuario");

    return sendSuccessResponse(res, 200, "Usuario encontrado", {
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return sendErrorResponse(res, error, "Error al obtener el usuario");
  }
};

export const UserController = {
  getUser,
};
