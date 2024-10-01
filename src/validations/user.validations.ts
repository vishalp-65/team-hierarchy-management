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
