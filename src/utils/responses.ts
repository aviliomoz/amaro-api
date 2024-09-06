import { Response } from "express";
import { getErrorInfo } from "./errors";

export const sendErrorResponse = (
  res: Response,
  error: unknown,
  message: string
) => {
  const { status, details } = getErrorInfo(error);

  return res.status(status).json({
    ok: false,
    message,
    error: details,
  });
};

export const sendSuccessResponse = (
  res: Response,
  status: number,
  message: string,
  data?: Record<string, any>,
  meta?: { count?: number; pages?: number }
) => {
  return res.status(status).json({
    ok: true,
    message,
    error: null,
    data,
    meta,
  });
};
