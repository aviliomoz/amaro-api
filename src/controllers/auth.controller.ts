import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { ApiResponse } from "../classes/response.class";
import { User } from "../models/user.model";
import { Account } from "../models/account.model";
import { Token } from "../classes/token.class";
import { addMonth } from "@formkit/tempo";
import { Login, Signup } from "../models/auth.model";

export class AuthController {

  static async signup(req: Request, res: Response) {
    try {
      const { name, lastname, email, password } = Signup.validate(req.body);

      const userFound = await User.getUserByEmail(email);
      if (userFound) throw new Error("Usuario ya existe");

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.createUser({ name, lastname, email })
      await Account.createAccount({ user_id: user.id!, password: hashedPassword })

      const refreshToken = Token.generate({ user_id: user.id! }, 60 * 60 * 24 * 30);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        expires: addMonth(new Date(), 1)
      })

      const accessToken = Token.generate({ user_id: user.id! }, 60 * 10)

      ApiResponse.send(res, 201, null, { user, accessToken }, "Usuario registrado exitosamente");
    } catch (error) {
      ApiResponse.send(res, 500, error, null, "Error al registrar el usuario")
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = Login.validate(req.body);

      const user = await User.getUserByEmail(email);
      if (!user) throw new Error("Credenciales inválidas");

      const account = await Account.getAccountByUserId(user.id!)

      const validatedPassword = await bcrypt.compare(password, account.password);
      if (!validatedPassword) throw new Error("Credenciales inválidas");

      const refreshToken = Token.generate({ user_id: user.id! }, 60 * 60 * 24 * 30);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        expires: addMonth(new Date(), 1)
      })

      const accessToken = Token.generate({ user_id: user.id! }, 60 * 10)

      ApiResponse.send(res, 202, null, { user, accessToken }, "Inicio de sesión exitoso");
    } catch (error) {
      ApiResponse.send(res, 500, error, null, "Error al iniciar sesión")
    }
  }

  static async check(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken as string | undefined
      if (!refreshToken) throw new Error("No hay sesión activa")

      const validatedToken = Token.validate(refreshToken)
      if (!validatedToken) throw new Error("Token inválido")

      const { user_id } = validatedToken

      const user = await User.getUserById(user_id)

      const accessToken = Token.generate({ user_id: user.id! }, 60 * 10)

      ApiResponse.send(res, 202, null, { user, accessToken }, "Sesión activa");

    } catch (error) {
      ApiResponse.send(res, 200, error, null, "Error al validar la sesión")
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      })
      ApiResponse.send(res, 200, null, null, "Sesión cerrada");
    } catch (error) {
      ApiResponse.send(res, 500, error, null, "Error al cerrar la sesión")
    }
  }

};
