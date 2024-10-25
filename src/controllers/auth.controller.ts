import catchAsync from "../utils/catchAsync";
import { Request, Response } from "express";
import { handleValidationErrors } from "../utils/errorHandler";
import {
    changePasswordSchema,
    loginUserSchema,
} from "../validations/authValidation";
import { AuthServiceInstance } from "../services/auth.service";
import sendResponse from "../utils/responseHandler";
import httpStatus from "http-status";

export const login = catchAsync(async (req: Request, res: Response) => {
    const validatedData = handleValidationErrors(
        loginUserSchema.safeParse(req.body)
    );

    const { email, password } = validatedData?.data;

    const user = await AuthServiceInstance.login(email, password);
    sendResponse(res, httpStatus.OK, true, "Logged in", user);
});

export const changePassword = catchAsync(
    async (req: Request, res: Response) => {
        const validatedData = handleValidationErrors(
            changePasswordSchema.safeParse(req.body)
        );

        const { email, password, newPassword } = validatedData?.data;

        await AuthServiceInstance.resetPassword(email, password, newPassword);
        sendResponse(res, httpStatus.OK, true, "Password change successfully");
    }
);
