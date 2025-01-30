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

export type LoginType = z.infer<typeof LoginSchema>
export type SignupType = z.infer<typeof SignupSchema>

export class Login {
    static validate(data: LoginType) {
        return LoginSchema.parse(data)
    }
}

export class Signup {
    static validate(data: SignupType) {
        return SignupSchema.parse(data)
    }
}