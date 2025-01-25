import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { sendApiResponse } from "../utils/responses";
import { LoginSchema, SignupSchema } from "../models/auth.model";
import { User } from "../models/user.model";
import { Account } from "../models/account.model";
import { generateToken, validateToken } from "../utils/tokens";
import { addMonth } from "@formkit/tempo";

export const AuthController = {

  signup: async (req: Request, res: Response) => {
    try {
      const { name, lastname, email, password } = SignupSchema.parse(req.body);

      const userFound = await User.getUserByEmail(email);
      if (userFound) throw new Error("Usuario ya existe");

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.createUser({ name, lastname, email })
      await Account.createAccount(user.id, hashedPassword)

      const refreshToken = generateToken({ userId: user.id }, 60 * 60 * 24 * 30);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        expires: addMonth(new Date(), 1)
      })

      const accessToken = generateToken({ userId: user.id }, 60 * 10)

      sendApiResponse(res, 201, null, { user, accessToken }, "Usuario registrado exitosamente");
    } catch (error) {
      sendApiResponse(res, 500, error, null, "Error al registrar el usuario")
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);

      const user = await User.getUserByEmail(email);
      if (!user) throw new Error("Credenciales inválidas");

      const account = await Account.getAccountByUserId(user.id)

      const validatedPassword = await bcrypt.compare(password, account.password);
      if (!validatedPassword) throw new Error("Credenciales inválidas");

      const refreshToken = generateToken({ userId: user.id }, 60 * 60 * 24 * 30);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        expires: addMonth(new Date(), 1)
      })

      const accessToken = generateToken({ userId: user.id }, 60 * 10)

      sendApiResponse(res, 202, null, { user, accessToken }, "Inicio de sesión exitoso");
    } catch (error) {
      sendApiResponse(res, 500, error, null, "Error al iniciar sesión")
    }
  },

  check: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken as string | undefined
      if (!refreshToken) throw new Error("No hay sesión activa")

      const validatedToken = validateToken(refreshToken)
      if (!validatedToken) throw new Error("Token inválido")

      const { userId } = validatedToken

      const user = await User.getUserById(userId)

      const accessToken = generateToken({ userId: user.id }, 60 * 10)

      sendApiResponse(res, 202, null, { user, accessToken }, "Sesión activa");

    } catch (error) {
      sendApiResponse(res, 200, error, null, "Error al validar la sesión")
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshToken")
      res.clearCookie("currentBranchId")
      sendApiResponse(res, 200, null, null, "Sesión cerrada");
    } catch (error) {
      sendApiResponse(res, 500, error, null, "Error al cerrar la sesión")
    }
  }

};
