import { z } from "zod";
import { db } from "../database/connection";

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;

const createUser = async (user: UserType): Promise<UserType | undefined> => {
  const data = await db.query(
    `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email
    `,
    [user.name, user.email, user.password]
  );

  return data.rows[0];
};

const getUserById = async (id: string): Promise<UserType | undefined> => {
  const data = await db.query(
    `
        SELECT id, name, email 
        FROM users 
        WHERE id = $1
    `,
    [id]
  );

  return data.rows[0];
};

const getUserByEmail = async (email: string): Promise<UserType | undefined> => {
  const data = await db.query(
    `
        SELECT * 
        FROM users 
        WHERE email = $1
    `,
    [email]
  );

  return data.rows[0];
};

export const User = {
  createUser,
  getUserById,
  getUserByEmail,
};
