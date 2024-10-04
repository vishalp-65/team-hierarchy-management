import { Request, Response } from "express";
import { brandSchema } from "../validations/reqValidations";
import { brandService } from "../services/brand.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";

export const createOrUpdateBrand = catchAsync(
    async (req: Request, res: Response) => {
        // Validate the request body
        const validatedBrand = brandSchema.parse(req.body);

        // Save or update the brand
        const brand = await brandService.createOrUpdateBrand(
            req.user,
            validatedBrand
        );
        return res.status(httpStatus.OK).json({ success: true, brand });
    }
);

export const getBrands = catchAsync(async (req: Request, res: Response) => {
    const brands = await brandService.getBrandsOwnedByUser(req.user.id);
    return res.status(httpStatus.OK).json({ success: true, brands });
});
