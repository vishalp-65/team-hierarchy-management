import { Request, Response } from "express";
import { contactSchema } from "../validations/reqValidations";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { contactService } from "../services/contact.service";
import { handleValidationErrors } from "../utils/errorHandler";
import sendResponse from "../utils/responseHandler";

// Create a new contact for a brand
export const createContact = catchAsync(async (req: Request, res: Response) => {
    const brandId = req.params.brandId;
    const validatedContact = handleValidationErrors(
        contactSchema.safeParse(req.body)
    );

    // Create contact and return updated brand details
    const contactWithBrand = await contactService.createContact(
        brandId,
        validatedContact?.data
    );
    sendResponse(
        res,
        httpStatus.CREATED,
        true,
        "Contact created",
        contactWithBrand
    );
});

// Update contact for a brand
export const updateContact = catchAsync(async (req: Request, res: Response) => {
    const brandId = req.params.brandId;
    const validatedContact = handleValidationErrors(
        contactSchema.safeParse(req.body)
    );

    // Update contact and return updated brand details
    const brand = await contactService.updateContact(
        brandId,
        validatedContact?.data
    );
    sendResponse(res, httpStatus.OK, true, "Contact updated", brand);
});
