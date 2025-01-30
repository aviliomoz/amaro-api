import { Response } from "express";
import { ZodError } from "zod";

const handleErrorMessage = (error: unknown) => {

    if (error instanceof ZodError) {
        return error.errors[0].message
    }

    if (error instanceof Error) {
        return error.message
    }

    return "Error no identificado"
}

export class ApiResponse {
    static send<T>(res: Response, status: number, error: unknown | null, data: T | null, message?: string) {
        return res.status(status).json({
            ok: !error,
            error: !error ? null : handleErrorMessage(error),
            data: !data ? null : data,
            message
        })
    }
}


