import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import {
    assignRoleSchema,
    brandSchema,
    userSchema,
} from "../validations/reqValidations";

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

// Update an existing brand
export const updateBrand = catchAsync(async (req: Request, res: Response) => {
    const brandId = Number(req.params.id);
    const validatedData = brandSchema.partial().parse(req.body);
    const brand = await adminService.updateBrand(brandId, validatedData);
    res.status(httpStatus.OK).json({ brand });
});

// Assign roles to a user
export const assignRoleToUser = catchAsync(
    async (req: Request, res: Response) => {
        const validatedData = assignRoleSchema.parse(req.body);
        const user = await adminService.assignRoleToUser(
            validatedData.userId,
            validatedData.roleIds
        );
        res.status(httpStatus.OK).json({ sucess: true, user });
    }
);

// List TOs above a user in the hierarchy
export const listUsersWithTOHierarchy = catchAsync(
    async (req: Request, res: Response) => {
        const userId = Number(req.params.userId);
        const hierarchy = await adminService.listUsersWithTOHierarchy(userId);
        res.status(httpStatus.OK).json({ sucess: true, hierarchy });
    }
);
