import { Response } from "express";
import { ZodError } from "zod";

export const sendApiResponse = <T>(res: Response, status: number, error: unknown | null, data: T | null, message?: string) => {
    return res.status(status).json({
        ok: !error,
        error: !error ? null : handleErrorMessage(error),
        data: !data ? null : data,
        message
    })
}

const handleErrorMessage = (error: unknown) => {

    if (error instanceof ZodError) {
        return error.errors[0].message
    }

    if (error instanceof Error) {
        return error.message
    }

    return "Error no identificado"
}
