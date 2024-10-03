// src/utils/zodSchemas.ts
import { z } from "zod";

export const userSchema = z.object({
    user_name: z.string().min(1, "Name is required"),
    password: z.string().min(8, "Password is required"),
    phone_number: z.string().length(10, "Phone number is required"),
    email: z.string().email("Valid email is required"),
    roles: z
        .array(z.enum(["ADMIN", "PO", "BO", "TO"]))
        .min(1, "At least one role is required"),
    managerId: z.number().positive().optional(), // Optional field for hierarchy
});

export const brandSchema = z.object({
    brand_name: z.string().min(1, "Brand name is required"),
    revenue: z.number().positive("Revenue should be a positive number"),
    deal_closed_value: z
        .number()
        .positive("Deal value should be a positive number"),
    contact_person_name: z.string().min(1, "Person name is required"),
    contact_person_phone: z.string().min(10, "Contact number is required"),
    contact_person_email: z.string().email("Person email is required"),
    ownerIds: z.array(z.number().positive()).min(1).optional(), // IDs of BOs
});

export const assignRoleSchema = z.object({
    userId: z.number().positive("User Id is required"),
    roleIds: z
        .array(z.number().positive())
        .min(1, "At least one role is required"),
});
