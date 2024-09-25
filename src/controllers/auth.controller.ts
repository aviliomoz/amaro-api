import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { LoginSchema, User, UserSchema } from "../models/user.model";
import { createToken } from "../utils/tokens";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";

const signup = async (req: Request, res: Response) => {
  try {
    const data = UserSchema.parse(req.body);

    const foundUser = await User.getUserByEmail(data.email);

    if (foundUser) {
      throw new Error("Usuario ya existe");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await User.createUser({ ...data, password: hashedPassword });

    if (!user) {
      throw new Error("Error al crear el usuario");
    }

    const token = createToken({
      name: user.name,
      email: user.email,
    });

    return sendSuccessResponse(res, 201, "Usuario creado", {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    return sendErrorResponse(res, error, "Error al registrar el usuario");
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const data = LoginSchema.parse(req.body);

    const user = await User.getUserByEmail(data.email);

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const validatedPassword = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!validatedPassword) {
      throw new Error("Credenciales inválidas");
    }

    const token = createToken({
      name: user.name,
      email: user.email,
    });

    return sendSuccessResponse(res, 200, "Login exitoso", {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    return sendErrorResponse(res, error, "Error al iniciar sesión");
  }
};

export const AuthController = {
  signup,
  login,
};
