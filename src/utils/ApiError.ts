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
export { ApiError };
