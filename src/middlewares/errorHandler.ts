import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Check if the error is an instance of ZodError
    if (err instanceof ZodError) {
        // Return only the first error
        const firstError = err.errors[0];

        return res.status(400).json({
            success: false,
            error: {
                path: firstError.path,
                message: firstError.message,
            },
        });
    }

    // Handle other types of errors
    return res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

export default errorMiddleware;
