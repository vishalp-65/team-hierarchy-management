import httpStatus from "http-status";

class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
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
