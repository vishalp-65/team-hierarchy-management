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

export const createInventory = catchAsync(
    async (req: Request, res: Response) => {
        const validatedData = handleValidationErrors(
            inventorySchema.safeParse(req.body)
        );

        const inventory = await InventoryAndEventInstance.createInventory(
            validatedData?.data
        );
        res.status(httpStatus.CREATED).json({
            success: true,
            message: "Inventory created",
            inventory,
        });
    }
);

export const updateInventory = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "ID not found",
            });
        }
        const validatedData = handleValidationErrors(
            inventorySchema.safeParse(req.body)
        );

        const inventory = await InventoryAndEventInstance.updateInventory(
            id,
            validatedData?.data
        );
        res.status(httpStatus.OK).json({
            success: true,
            message: "Inventory updated",
            inventory,
        });
    }
);

export const deleteInventory = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "ID not found",
            });
        }
        await InventoryAndEventInstance.deleteInventory(id);
        res.status(httpStatus.OK).json({
            success: true,
            message: "Inventory deleted",
        });
    }
);

export const getInventoryById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "ID not found",
            });
        }
        const inventory = await InventoryAndEventInstance.getInventoryById(id);
        res.status(httpStatus.OK).json({ success: true, inventory });
    }
);

export const getInventories = catchAsync(
    async (req: Request, res: Response) => {
        const inventories = await InventoryAndEventInstance.getInventories();
        res.status(httpStatus.OK).json({ success: true, inventories });
    }
);

export const createEvent = catchAsync(async (req: Request, res: Response) => {
    const validatedData = handleValidationErrors(
        eventSchema.safeParse(req.body)
    );

    const event = await InventoryAndEventInstance.createEvent(
        validatedData?.data
    );
    res.status(httpStatus.CREATED).json({
        success: true,
        message: "Event created",
        event,
    });
});

export const updateEvent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "ID not found",
        });
    }

    const validatedData = handleValidationErrors(
        eventSchema.safeParse(req.body)
    );

    const event = await InventoryAndEventInstance.updateEvent(
        id,
        validatedData?.data
    );
    res.status(httpStatus.OK).json({
        success: true,
        message: "Event updated",
        event,
    });
});

export const deleteEvent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "ID not found",
        });
    }
    await InventoryAndEventInstance.deleteEvent(id);
    res.status(httpStatus.OK).json({ success: true, message: "Event deleted" });
});

export const getEventById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "ID not found",
        });
    }
    const event = await InventoryAndEventInstance.getEventById(id);
    res.status(httpStatus.OK).json({ success: true, event });
});

export const getEvents = catchAsync(async (req: Request, res: Response) => {
    const events = await InventoryAndEventInstance.getEvents();
    res.status(httpStatus.OK).json({ success: true, events });
});
