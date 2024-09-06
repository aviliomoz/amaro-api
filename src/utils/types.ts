import type { Request } from "express";
import { IUserInfo } from "../models/user.model";

export type CustomRequest = Request & {
  user: IUserInfo;
};

export type Token = {
  user: IUserInfo;
  iat: number;
  exp: number;
};

export type TokenVerification = {
  error: null | string;
  token: null | Token;
};
