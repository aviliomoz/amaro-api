import { Request, Response } from "express";
import { User, UserSchema } from "../models/user.model";
import { sendApiResponse } from "../utils/responses";

export const UserController = {

  getUserById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      const user = await User.getUserById(id);

      sendApiResponse(res, 200, null, user, "Usuario encontrado");
    } catch (error) {
      sendApiResponse(res, 500, error, null, "Error al obtener el usuario");
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const body = UserSchema.parse(req.body);

      const user = await User.updateUser(body);

      sendApiResponse(res, 200, null, user, "Usuario actualizado exitosamente");
    } catch (error) {
      sendApiResponse(res, 500, error, null, "Error al actualizar el usuario");
    }
  }
  
};
