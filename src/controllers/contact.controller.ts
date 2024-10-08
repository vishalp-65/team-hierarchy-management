import { Request, Response } from "express";
import { contactSchema } from "../validations/reqValidations";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { contactService } from "../services/contact.service";

// Create a new contact for a brand
export const createContact = catchAsync(async (req: Request, res: Response) => {
    const brandId = parseInt(req.params.brandId, 10);
    const validatedContact = contactSchema.parse(req.body);

    // Create contact and return updated brand details
    const brand = await contactService.createContact(brandId, validatedContact);
    return res.status(httpStatus.CREATED).json({ success: true, brand });
});

// Update contact for a brand
export const updateContact = catchAsync(async (req: Request, res: Response) => {
    const brandId = parseInt(req.params.brandId, 10);
    const validatedContact = contactSchema.parse(req.body);

    // Update contact and return updated brand details
    const brand = await contactService.updateContact(brandId, validatedContact);
    return res.status(httpStatus.OK).json({ success: true, brand });
});
