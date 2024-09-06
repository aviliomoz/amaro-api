import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";
import { IUser, User } from "../models/user.model";
import { AppError } from "../utils/errors";

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const foundUser = await User.findById(id);

    if (!foundUser) {
      throw new AppError(400, "Usuario no encontrado");
    }

    const user = {
      _id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
    } as IUser;

    return sendSuccessResponse(res, 200, "Usuario encontrado", user);
  } catch (error) {
    return sendErrorResponse(
      res,
      error,
      "Error al cargar los datos del usuario"
    );
  }
};
