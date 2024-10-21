import httpStatus from "http-status";

class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(
        statusCode: number,
        message: any,
        isOperational = true,
        stack = ""
    ) {
        super(message); // Keep the message simple
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const handleInvalidNodeError = () =>
    new ApiError(httpStatus.BAD_REQUEST, "Invalid Node");
const handleCycleError = () =>
    new ApiError(
        httpStatus.CONFLICT,
        "Cycle detected in the organization tree"
    );

export { ApiError, handleInvalidNodeError, handleCycleError };
