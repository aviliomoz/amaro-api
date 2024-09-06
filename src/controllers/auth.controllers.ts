import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { createToken } from "../utils/tokens";
import { IUser, User } from "../models/user.model";
import { Token } from "../utils/types";
import { AppError } from "../utils/errors";
import { sendErrorResponse, sendSuccessResponse } from "../utils/responses";

export const signup = async (req: Request, res: Response) => {
  const data = req.body as IUser;

  try {
    const foundUser = await User.findOne({ email: data.email });

    if (foundUser)
      throw new AppError(400, "El correo ingresado ya se encuentra registrado");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await User.create({ ...data, password: hashedPassword });

    const user = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    } as IUser;

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
    });

    return sendSuccessResponse(res, 200, "Registro exitoso", user);
  } catch (error) {
    return sendErrorResponse(res, error, "Error al registrar el usuario");
  }
};

export const login = async (req: Request, res: Response) => {
  const data = req.body as IUser;

  try {
    const user = await User.findOne({ email: data.email });

    if (!user) throw new AppError(401, "Credenciales inválidas");

    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) throw new AppError(401, "Credenciales inválidas");

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
    } as IUser;

    const token = createToken(safeUser);

    res.cookie("token", token, {
      httpOnly: true,
    });

    return sendSuccessResponse(res, 200, "Inicio de sesión exitoso", safeUser);
  } catch (error) {
    return sendErrorResponse(res, error, "Error al iniciar sesión");
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("token");

    return sendSuccessResponse(res, 200, "Se ha cerrado sesión");
  } catch (error) {
    return sendErrorResponse(res, error, "Error al cerrar sesión");
  }
};

export const check = (req: Request, res: Response) => {
  const token: string = req.cookies.token;

  try {
    if (!token) throw new AppError(401, "No se ha podido validar la sesión");

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as Token;

    if (!decoded.user)
      throw new AppError(401, "No se ha podido validar la sesión");

    return sendSuccessResponse(res, 200, "Sesión activa", decoded.user);
  } catch (error) {
    return sendErrorResponse(res, error, "Sesión cerrada");
  }
};
