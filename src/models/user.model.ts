import { z } from "zod";
import { db } from "../lib/database";

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100),
  lastname: z.string().max(100),
  email: z.string().email().max(100),
});

export type UserType = z.infer<typeof UserSchema>;
export type NewUserType = Omit<UserType, "id">

export class User {

  static validate(data: NewUserType) {
    return UserSchema.omit({ id: true }).parse(data)
  }

  static async createUser(user: NewUserType): Promise<UserType> {
    const query = "INSERT INTO users (name, lastname, email) VALUES ($1, $2, $3) RETURNING *";
    const values = [user.name, user.lastname, user.email];

    const result = await db.query(query, values);
    return result.rows[0] as UserType
  }

  static async getUserById(id: string): Promise<UserType> {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [id];

    const result = await db.query(query, values);
    return result.rows[0] as UserType;
  }

  static async getUserByEmail(email: string): Promise<UserType> {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    const result = await db.query(query, values);
    return result.rows[0] as UserType;
  }

  static async updateUser(id: string, user: NewUserType): Promise<UserType> {
    const query = "UPDATE users SET name = $2, email = $3 WHERE id = $1 RETURNING *";
    const values = [id, user.name, user.email];

    const result = await db.query(query, values);
    return result.rows[0] as UserType;
  }
};
