import { ZodError } from "zod";

type ErrorInfo = {
  status: number;
  details: string;
};

export class AppError extends Error {
  public readonly code: number;

  constructor(code: number, details: string) {
    super(details);
    this.code = code;

    // Setting the prototype explicitly is necessary for custom errors in TypeScript.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const getErrorInfo = (error: unknown): ErrorInfo => {
  if (error instanceof AppError) {
    return {
      status: error.code,
      details: error.message,
    };
  }

  if (error instanceof ZodError) {
    return {
      status: 400,
      details: error.errors[0].message,
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      details: error.message,
    };
  }

  return {
    status: 501,
    details: "Unidentified server error",
  };
};
