import httpStatus from "http-status";
import { ApiError } from "./ApiError";

/**
 * Handles validation errors from Zod and throws an appropriate error response.
 * @param result Zod schema validation result.
 * @returns Parsed data or throws an error.
 */
export const handleValidationErrors = (result: any) => {
    if (!result.success) {
        const errorMessages = result.error.errors
            .map((err: any) => `${err.path.join(".")} ${err.message}`)
            .join(", "); // Join all error messages with a comma

        throw new ApiError(httpStatus.BAD_REQUEST, errorMessages);
    }
    return result;
};
