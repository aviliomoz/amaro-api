import { z } from "zod";
import { db } from "../lib/database";

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100),
  lastname: z.string().max(100),
  email: z.string().email().max(100),
});

export type User = z.infer<typeof UserSchema>;
export type NewUser = Omit<User, "id">

export const User = {

  createUser: async (user: NewUser): Promise<User> => {
    const query = "INSERT INTO users (name, lastname, email) VALUES ($1, $2, $3) RETURNING *";
    const values = [user.name, user.lastname, user.email];

    const result = await db.query(query, values);
    return result.rows[0] as User
  },

  getUserById: async (id: string): Promise<User> => {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [id];

    const result = await db.query(query, values);
    return result.rows[0] as User;
  },

  getUserByEmail: async (email: string): Promise<User> => {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    const result = await db.query(query, values);
    return result.rows[0] as User;
  },

  updateUser: async (user: User): Promise<User> => {
    const query = "UPDATE users SET name = $2, email = $3 WHERE id = $1 RETURNING *";
    const values = [user.id, user.name, user.email];

    const result = await db.query(query, values);
    return result.rows[0] as User;
  }
};
