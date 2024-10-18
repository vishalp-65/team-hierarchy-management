import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import {
    assignRoleSchema,
    brandSchema,
    userSchema,
} from "../validations/reqValidations";
import { handleValidationErrors } from "../utils/errorHandler";

// Create a new user
export const createUser = catchAsync(async (req: Request, res: Response) => {
    const validatedData = handleValidationErrors(
        userSchema.safeParse(req.body)
    );

    const user = await adminService.createUser(validatedData?.data);
    res.status(httpStatus.CREATED).json({ success: true, user });
});

// Update an existing user
export const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const validatedData = handleValidationErrors(
        userSchema.partial().safeParse(req.body)
    );
    const user = await adminService.updateUser(userId, validatedData?.data);
    res.status(httpStatus.OK).json({ success: true, user });
});

// Create a new brand
export const createBrand = catchAsync(async (req: Request, res: Response) => {
    const validatedData = handleValidationErrors(
        brandSchema.safeParse(req.body)
    );
    const brand = await adminService.createBrand(validatedData?.data);
    res.status(httpStatus.CREATED).json({ success: true, brand });
});

// Update an existing brand
export const updateBrand = catchAsync(async (req: Request, res: Response) => {
    const brandId = req.params.id;
    const validatedData = handleValidationErrors(
        brandSchema.partial().safeParse(req.body)
    );

    const brand = await adminService.updateBrand(brandId, validatedData?.data);
    res.status(httpStatus.OK).json({ success: true, brand });
});

// Assign roles to a user
export const assignRoleToUser = catchAsync(
    async (req: Request, res: Response) => {
        const validatedData = handleValidationErrors(
            assignRoleSchema.safeParse(req.body)
        );

        const user = await adminService.assignRoleToUser(
            validatedData?.data?.userId,
            validatedData?.data?.roleIds
        );
        res.status(httpStatus.OK).json({ success: true, user });
    }
);

// List TOs above a user in the hierarchy
export const listUsersWithTOHierarchy = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.params.userId;
        if (!userId) {
            res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "UserId required",
            });
        }
        const hierarchy = await adminService.listUsersWithTOHierarchy(userId);
        res.status(httpStatus.OK).json({ success: true, hierarchy });
    }
);
