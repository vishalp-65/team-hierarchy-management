// validations/inventory.ts
import { z } from "zod";

export const inventorySchema = z.object({
    name: z.string().max(100),
    description: z.string().optional(),
    quantity: z.number().int().min(0),
    status: z.enum(["available", "out_of_stock", "reserved"]),
});

export const updateInventorySchema = inventorySchema.partial();

export const eventSchema = z.object({
    name: z.string().max(100),
    description: z.string().optional(),
    event_date: z
        .string()
        .optional()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .refine((val) => new Date(val) > new Date(), {
            message: "Due date must be in the future",
        })
        .transform((val) => new Date(val)),
});

export const updateEventSchema = eventSchema.partial();
