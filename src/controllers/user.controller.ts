import { Request, Response } from "express";
import { User, UserSchema } from "../models/user.model";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await User.getUserById(id);

    if (error) throw new Error(error.message);
    if (!data) throw new Error("No se encontró el usuario");

    return sendSuccessResponse(res, 200, "Usuario encontrado", data);
  } catch (error) {
    return sendErrorResponse(res, error, "Error al obtener el usuario");
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = UserSchema.omit({ password: true }).parse(req.body);

    const { data, error } = await User.updateUser(id, body);

    if (error) throw new Error(error.message);
    if (!data) throw new Error("No se pudo actualizar");

    return sendSuccessResponse(res, 200, "Usuario actualizado", data);
  } catch (error) {
    return sendErrorResponse(res, error, "Error al actualizar el usuario");
  }
};

export const UserController = {
  getUser,
  updateUser,
};
