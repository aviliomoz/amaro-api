import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { LoginSchema, User, UserSchema } from "../models/user.model";
import { createToken } from "../utils/tokens";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";

const signup = async (req: Request, res: Response) => {
  try {
    const body = UserSchema.parse(req.body);

    const { data: foundUser } = await User.getUserByEmail(body.email);

    if (foundUser) throw new Error("Usuario ya existe");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const { data: user, error } = await User.createUser({
      ...body,
      password: hashedPassword,
    });

    if (error) throw new Error(error.message);
    if (!user) throw new Error("Error al crear el usuario");

    const token = createToken(user);

    return sendSuccessResponse(res, 201, "Usuario creado", {
      user,
      token,
    });
  } catch (error) {
    return sendErrorResponse(res, error, "Error al registrar el usuario");
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const body = LoginSchema.parse(req.body);

    const { data: user, error } = await User.getUserByEmail(body.email);

    if (error) throw new Error(error.message);
    if (!user) throw new Error("Credenciales inválidas");

    const validatedPassword = await bcrypt.compare(
      body.password,
      user.password
    );

    if (!validatedPassword) throw new Error("Credenciales inválidas");

    const token = createToken({
      id: user.id!,
      name: user.name,
      email: user.email,
    });

    return sendSuccessResponse(res, 200, "Login exitoso", {
      user: {
        id: user.id!,
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
