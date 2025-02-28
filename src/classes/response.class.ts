import { Response } from "express";
import { handleErrorMessage } from "../utils/errors";

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


