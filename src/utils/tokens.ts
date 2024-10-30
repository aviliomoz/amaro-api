import jwt from "jsonwebtoken";

export const createRefreshToken = (payload: Record<string, string>) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: 60 * 60 * 24 * 30,
  });
};

export const createAccessToken = (payload: Record<string, string>) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: 60 * 10,
  });
};

export const createSessionToken = (payload: Record<string, string>) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: 60 * 60 * 24 * 365,
  });
};

// Cambiar Record<string, string> por el tipo específico
