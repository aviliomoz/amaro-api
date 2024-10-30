import bcrypt from "bcryptjs";
import jwt, { Jwt } from "jsonwebtoken"
import { Request, Response } from "express";
import { sendApiResponse } from "../utils/responses";
import { LoginSchema, SignupSchema } from "../models/auth.model";
import { User } from "../models/user.model";
import { Account } from "../models/account.model";
import { createAccessToken, createRefreshToken } from "../utils/tokens";
import { JWT } from "../utils/types";

const signup = async (req: Request, res: Response) => {
  try {
    const body = SignupSchema.parse(req.body);

    const userFound = await User.getUserByEmail(body.email);
    if (userFound) throw new Error("Usuario ya existe");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const user = await User.createUser({ name: body.name, email: body.email })
    await Account.createAccount(user.id!, hashedPassword)

    const refreshToken = createRefreshToken({ payload: user.id! });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production"
    })

    const accessToken = createAccessToken({ payload: user.id! })

    sendApiResponse(res, 201, null, { user, accessToken }, "Usuario registrado exitosamente");
  } catch (error) {
    sendApiResponse(res, 500, error, null, "Error al registrar el usuario")
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const body = LoginSchema.parse(req.body);

    const user = await User.getUserByEmail(body.email);
    if (!user) throw new Error("Credenciales inválidas");

    const account = await Account.getAccountByUserId(user.id!)

    const validatedPassword = await bcrypt.compare(body.password, account.password);
    if (!validatedPassword) throw new Error("Credenciales inválidas");

    const refreshToken = createRefreshToken({ payload: user.id! });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production"
    })

    const accessToken = createAccessToken({ payload: user.id! })

    sendApiResponse(res, 202, null, { user, accessToken }, "Inicio de sesión exitoso");
  } catch (error) {
    sendApiResponse(res, 500, error, null, "Error al iniciar sesión")
  }
};

const check = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken as string | undefined
    if (!refreshToken) throw new Error("No hay sesión activa")

    const validatedToken = jwt.verify(refreshToken, process.env.JWT_SECRET!) as JWT
    if (!validatedToken) throw new Error("Token inválido")

    const { payload: user_id } = validatedToken

    const user = await User.getUserById(user_id)
    const accessToken = createAccessToken({ payload: user_id })

    sendApiResponse(res, 202, null, { user, accessToken }, "Sesión activa");

  } catch (error) {
    sendApiResponse(res, 500, error, null, "Error al validar la sesión")
  }
}

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken")
    sendApiResponse(res, 200, null, null, "Sesión cerrada");
  } catch (error) {
    sendApiResponse(res, 500, error, null, "Error al cerrar la sesión")
  }
}

export const AuthController = {
  signup,
  login,
  check,
  logout
};
