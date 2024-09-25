import jwt from "jsonwebtoken";

export const createToken = (payload: Record<string, string>) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: 60 * 60 * 24,
  });
};
