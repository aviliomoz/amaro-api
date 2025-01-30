import jwt from "jsonwebtoken";
import { AuthPayload } from "../utils/types";

export class Token {
  static generate(payload: AuthPayload, expiration: number) {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: expiration,
    });
  }

  static validate(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload
  }
}


