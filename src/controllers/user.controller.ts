// src/controllers/admin.controller.ts
import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { brandSchema, userSchema } from "../validations/user.validations";

// Create a new user
export const createUser = catchAsync(async (req: Request, res: Response) => {
    const validatedData = userSchema.parse(req.body);
    const user = await adminService.createUser(validatedData);
    res.status(httpStatus.CREATED).json({ user });
});

// Update an existing user
export const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const validatedData = userSchema.partial().parse(req.body);
    const user = await adminService.updateUser(userId, validatedData);
    res.status(httpStatus.OK).json({ user });
});

// Create a new brand
export const createBrand = catchAsync(async (req: Request, res: Response) => {
    const validatedData = brandSchema.parse(req.body);
    const brand = await adminService.createBrand(validatedData);
    res.status(httpStatus.CREATED).json({ brand });
});
