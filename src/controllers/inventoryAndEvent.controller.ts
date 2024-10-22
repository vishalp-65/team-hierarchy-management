// controllers/inventoryAndEvent.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { InventoryAndEventInstance } from "../services/inventoryAndEvent.service";
import {
    eventSchema,
    inventorySchema,
} from "../validations/inventoryAndEvent.validation";
import { handleValidationErrors } from "../utils/errorHandler";
import sendResponse from "../utils/responseHandler";
import { IGetUserAuthInfoRequest } from "../middlewares/auth.middleware";

export const createInventory = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const validatedData = handleValidationErrors(
            inventorySchema.safeParse(req.body)
        );

        const inventory = await InventoryAndEventInstance.createInventory(
            validatedData?.data,
            req.user.id
        );
        sendResponse(
            res,
            httpStatus.CREATED,
            true,
            "Inventory created",
            inventory
        );
    }
);

export const updateInventory = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            sendResponse(res, httpStatus.BAD_REQUEST, false, "ID not found");
        }
        const validatedData = handleValidationErrors(
            inventorySchema.safeParse(req.body)
        );

        const inventory = await InventoryAndEventInstance.updateInventory(
            id,
            validatedData?.data
        );
        sendResponse(res, httpStatus.OK, true, "Inventory updated", inventory);
    }
);

export const deleteInventory = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            sendResponse(res, httpStatus.BAD_REQUEST, false, "ID not found");
        }
        await InventoryAndEventInstance.deleteInventory(id);

        sendResponse(res, httpStatus.OK, true, "Inventory deleted");
    }
);

export const getInventoryById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            sendResponse(res, httpStatus.BAD_REQUEST, false, "ID not found");
        }
        const inventory = await InventoryAndEventInstance.getInventoryById(id);
        sendResponse(
            res,
            httpStatus.OK,
            true,
            "Filtered inventories",
            inventory
        );
    }
);

export const getInventories = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const inventories = await InventoryAndEventInstance.getInventories(
            req.user.id
        );
        sendResponse(res, httpStatus.OK, true, "All inventories", inventories);
    }
);

export const createEvent = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const validatedData = handleValidationErrors(
            eventSchema.safeParse(req.body)
        );

        const event = await InventoryAndEventInstance.createEvent(
            validatedData?.data,
            req.user.id
        );
        sendResponse(res, httpStatus.CREATED, true, "Event created", event);
    }
);

export const updateEvent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        sendResponse(res, httpStatus.BAD_REQUEST, false, "ID not found");
    }

    const validatedData = handleValidationErrors(
        eventSchema.safeParse(req.body)
    );

    const event = await InventoryAndEventInstance.updateEvent(
        id,
        validatedData?.data
    );
    sendResponse(res, httpStatus.OK, true, "Event Updated", event);
});

export const deleteEvent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        sendResponse(res, httpStatus.BAD_REQUEST, false, "ID not found");
    }
    await InventoryAndEventInstance.deleteEvent(id);
    sendResponse(res, httpStatus.OK, true, "Event deleted");
});

export const getEventById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        sendResponse(res, httpStatus.BAD_REQUEST, false, "ID not found");
    }
    const event = await InventoryAndEventInstance.getEventById(id);
    sendResponse(res, httpStatus.OK, true, "Filtered events");
});

export const getEvents = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const events = await InventoryAndEventInstance.getEvents(req.user.id);
        sendResponse(res, httpStatus.OK, true, "All events");
    }
);
