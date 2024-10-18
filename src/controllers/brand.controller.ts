import { Response } from "express";
import { brandSchema } from "../validations/reqValidations";
import { brandService } from "../services/brand.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { IGetUserAuthInfoRequest } from "../middlewares/auth.middleware";
import { handleValidationErrors } from "../utils/errorHandler";

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
        return res.status(httpStatus.OK).json({ success: true, brand });
    }
);

export const UpdateBrand = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        // Validate the request body
        const brandId = req.params.id;
        const validatedBrand = handleValidationErrors(
            brandSchema.safeParse(req.body)
        );

        // Save or update the brand
        const brand = await brandService.updateBrand(
            req.user,
            brandId,
            validatedBrand?.data
        );
        return res.status(httpStatus.OK).json({ success: true, brand });
    }
);

export const getBrands = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const brands = await brandService.getBrandsOwnedByUser(req.user.id);
        return res.status(httpStatus.OK).json({ success: true, brands });
    }
);

export const getBrandDetails = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const brandId = req.params.brandId;
        const userId = req.user.id;
        const result = await brandService.getBrandDetails(userId, brandId);
        res.status(httpStatus.OK).json({ success: true, result });
    }
);
