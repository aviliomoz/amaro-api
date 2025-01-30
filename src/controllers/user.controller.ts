import { Request, Response } from "express";
import { User } from "../models/user.model";
import { ApiResponse } from "../classes/response.class";

export class UserController {

  static async getUserById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const user = await User.getUserById(id);

      ApiResponse.send(res, 200, null, user, "Usuario encontrado");
    } catch (error) {
      ApiResponse.send(res, 500, error, null, "Error al obtener el usuario");
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const id = req.params.id as string
      const body = User.validate(req.body);

      const user = await User.updateUser(id, body);

      ApiResponse.send(res, 200, null, user, "Usuario actualizado exitosamente");
    } catch (error) {
      ApiResponse.send(res, 500, error, null, "Error al actualizar el usuario");
    }
  }

};
