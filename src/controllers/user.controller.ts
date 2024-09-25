import { Request, Response } from "express";
import { User, UserSchema } from "../models/user.model";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.getUserById(id);

    if (!user) throw new Error("No se encontró el usuario");

    return sendSuccessResponse(res, 200, "Usuario encontrado", user);
  } catch (error) {
    return sendErrorResponse(res, error, "Error al obtener el usuario");
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = UserSchema.partial().parse(req.body);

    const user = await User.updateUser(id, data);

    if (!user) throw new Error("No se pudo actualizar");

    return sendSuccessResponse(res, 200, "Usuario actualizado", user);
  } catch (error) {
    return sendErrorResponse(res, error, "Error al actualizar el usuario");
  }
};

export const UserController = {
  getUser,
  updateUser,
};
