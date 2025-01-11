import jwt from "jsonwebtoken";
import { AuthPayload } from "./types";

export const generateToken = (payload: AuthPayload, expiration: number) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expiration,
  });
}

export const validateToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload
}
