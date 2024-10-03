// src/controllers/brandController.ts
import { Request, Response, NextFunction } from "express";
import { brandSchema } from "../validations/reqValidations";
import { brandService } from "../services/brand.service";
import catchAsync from "../utils/catchAsync";

export const createOrUpdateBrand = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // Validate the request body
        const validatedBrand = brandSchema.parse(req.body);

        // Save or update the brand
        const brand = await brandService.createOrUpdateBrand(
            req.user,
            validatedBrand
        );
        return res.status(200).json({ success: true, brand });
    }
);

export const getBrands = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const brands = await brandService.getBrandsOwnedByUser(req.user.id);
        return res.status(200).json({ success: true, brands });
    }
);
