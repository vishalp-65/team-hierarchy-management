// src/controllers/admin.controller.ts
import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { userSchema } from "../validations/user.validations";

// Create a new user
export const createUser = catchAsync(async (req: Request, res: Response) => {
    const validatedData = userSchema.parse(req.body);
    const user = await adminService.createUser(validatedData);
    res.status(httpStatus.CREATED).json({ user });
});
