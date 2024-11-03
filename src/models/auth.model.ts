import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const SignupSchema = z.object({
    name: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    password: z.string(),
});

export type LoginData = z.infer<typeof LoginSchema>
export type SignupData = z.infer<typeof SignupSchema>
