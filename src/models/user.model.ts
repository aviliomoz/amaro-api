import { z } from "zod";
import { db } from "../database/connection";
import { ModelResult } from "../utils/types";

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
export type CleanUserType = Omit<UserType, "password">;

const createUser = async (
  user: UserType
): Promise<ModelResult<CleanUserType>> => {
  await db.query("BEGIN");

  try {
    const query = `
          INSERT INTO users (name, email, password)
          VALUES ($1, $2, $3)
          RETURNING id, name, email
      `;

    const values = [user.name, user.email, user.password];

    const result = await db.query(query, values);

    await db.query("COMMIT");

    return {
      data: result.rows[0],
      error: null,
    };
  } catch (error) {
    await db.query("ROLLBACK");
    return {
      error: error as Error,
      data: null,
    };
  }
};

const getUserById = async (id: string): Promise<ModelResult<CleanUserType>> => {
  try {
    const query = `
        SELECT id, name, email 
        FROM users 
        WHERE id = $1
    `;

    const values = [id];

    const result = await db.query(query, values);

    return {
      data: result.rows[0],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
};

const getUserByEmail = async (
  email: string
): Promise<ModelResult<UserType>> => {
  try {
    const query = `
        SELECT * 
        FROM users 
        WHERE email = $1
    `;

    const values = [email];

    const result = await db.query(query, values);

    return {
      data: result.rows[0],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
};

const updateUser = async (
  id: string,
  user: CleanUserType
): Promise<ModelResult<CleanUserType>> => {
  const query = `
      UPDATE users
      SET name = $2, email = $3
      WHERE id = $1
      RETURNING id, name, email
    `;

  const values = [id, user.name, user.email];

  await db.query("BEGIN");

  try {
    const result = await db.query(query, values);

    await db.query("COMMIT");

    return {
      data: result.rows[0],
      error: null,
    };
  } catch (error) {
    await db.query("ROLLBACK");
    return {
      error: error as Error,
      data: null,
    };
  }
};

export const User = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
};
