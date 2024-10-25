import { Response } from "express";
import {
    brandSchema,
    paginationSchema,
    updateBrandSchema,
} from "../validations/reqValidations";
import { brandService } from "../services/brand.service";
import { catchAsync } from "../utils/catchAsync";
import httpStatus from "http-status";
import { IGetUserAuthInfoRequest } from "../middlewares/auth.middleware";
import { handleValidationErrors } from "../utils/errorHandler";
import sendResponse from "../utils/responseHandler";

export const createBrand = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        // Validate the request body
        const validatedBrand = handleValidationErrors(
            brandSchema.safeParse(req.body)
        );

        // Save or update the brand
        const brand = await brandService.createBrand(
            req.user,
            validatedBrand?.data
        );
        sendResponse(res, httpStatus.CREATED, true, "Brand created", brand);
    }
);

export const updateBrand = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        // Validate the request body
        const brandId = req.params.id;
        const validatedBrand = handleValidationErrors(
            updateBrandSchema.safeParse(req.body)
        );

        // Save or update the brand
        const brand = await brandService.updateBrand(
            req.user,
            brandId,
            validatedBrand?.data
        );
        sendResponse(res, httpStatus.OK, true, "Brand updated", brand);
    }
);

export const getBrands = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        let brands: any;
        // Validate and parse options with Zod
        const parsedOptions = handleValidationErrors(
            paginationSchema.safeParse(req.query)
        );
        const { page, limit } = parsedOptions.data;

        const userRoles = req.user.roles.map((role) => role.role_name);

        if (userRoles.includes("ADMIN") || userRoles.includes("MG")) {
            // ADMIN and MG have access to all brands
            brands = await brandService.getAllBrands(
                {
                    page: page,
                    limit: limit,
                },
                req.user.id
            );
        } else {
            // For TO, PO, BO, only show their owned or authorized brands
            brands = await brandService.getBrandsOwnedByUser(req.user.id);
        }
        sendResponse(res, httpStatus.OK, true, "All brands", brands);
    }
);

export const getBrandDetails = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const brandId = req.params.brandId;
        const userId = req.user.id;
        const result = await brandService.getBrandDetails(userId, brandId);
        sendResponse(res, httpStatus.OK, true, "Brand details", result);
    }
);
