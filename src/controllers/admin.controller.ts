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
import sendResponse from "../utils/responseHandler";

// Create a new user
export const createUser = catchAsync(async (req: Request, res: Response) => {
    const validatedData = handleValidationErrors(
        userSchema.safeParse(req.body)
    );

    const user = await adminService.createUser(validatedData?.data);
    sendResponse(res, httpStatus.CREATED, true, "User created", user);
});

// Update an existing user
export const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const validatedData = handleValidationErrors(
        userSchema.partial().safeParse(req.body)
    );
    const user = await adminService.updateUser(userId, validatedData?.data);
    sendResponse(res, httpStatus.OK, true, "User updated", user);
});

// Create a new brand
export const createBrand = catchAsync(async (req: Request, res: Response) => {
    const validatedData = handleValidationErrors(
        brandSchema.safeParse(req.body)
    );
    const brand = await adminService.createBrand(validatedData?.data);
    sendResponse(res, httpStatus.CREATED, true, "Brand created", brand);
});

// Update an existing brand
export const updateBrand = catchAsync(async (req: Request, res: Response) => {
    const brandId = req.params.id;
    const validatedData = handleValidationErrors(
        brandSchema.partial().safeParse(req.body)
    );

    const brand = await adminService.updateBrand(brandId, validatedData?.data);
    sendResponse(res, httpStatus.OK, true, "Brand updated", brand);
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
        sendResponse(res, httpStatus.OK, true, "Role assigned", user);
    }
);

// List TOs above a user in the hierarchy
export const listUsersWithTOHierarchy = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.params.userId;
        if (!userId) {
            sendResponse(
                res,
                httpStatus.BAD_REQUEST,
                false,
                "User ID required"
            );
        }
        const hierarchy = await adminService.listUsersWithTOHierarchy(userId);
        sendResponse(res, httpStatus.OK, true, "User hierarchy", hierarchy);
    }
);
