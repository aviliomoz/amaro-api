import { z } from "zod";
import { db } from "../lib/database";

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

const createUser = async (user: User): Promise<User> => {
  const query = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";
  const values = [user.name, user.email];

  const result = await db.query(query, values);
  return result.rows[0] as User
};

const getUserById = async (id: string): Promise<User> => {
  const query = "SELECT * FROM users WHERE id = $1";
  const values = [id];

  const result = await db.query(query, values);
  return result.rows[0] as User;
};

const getUserByEmail = async (email: string): Promise<User> => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];

  const result = await db.query(query, values);
  return result.rows[0] as User;
};

const updateUser = async (user: User): Promise<User> => {
  const query = "UPDATE users SET name = $2, email = $3 WHERE id = $1 RETURNING *";
  const values = [user.id, user.name, user.email];

  const result = await db.query(query, values);
  return result.rows[0] as User;
};

export const User = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
};
