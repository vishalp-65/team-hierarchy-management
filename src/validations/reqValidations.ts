import { z } from "zod";

export const userSchema = z.object({
    user_name: z.string().min(1, "Name is required"),
    password: z.string().min(8, "Password is required"),
    phone_number: z.string().length(10, "Phone number is required"),
    email: z.string().email("Valid email is required"),
    roles: z
        .array(z.enum(["ADMIN", "MG", "PO", "BO", "TO"]))
        .min(1, "At least one role is required"),
    managerId: z.string().optional(), // Optional field for hierarchy
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
    ownerIds: z.array(z.string()).min(1).optional(), // IDs of BOs
});

export const updateBrandSchema = z
    .object({
        brand_name: z.string().optional(),
        revenue: z
            .number()
            .positive("Revenue should be a positive number")
            .optional(),
        deal_closed_value: z
            .number()
            .positive("Deal value should be a positive number")
            .optional(),
        contact_person_name: z
            .string()
            .min(1, "Person name is required")
            .optional(),
        contact_person_phone: z
            .string()
            .min(10, "Contact number is required")
            .optional(),
        contact_person_email: z
            .string()
            .email("Person email is required")
            .optional(),
        ownerIds: z.array(z.string()).min(1).optional(), // IDs of BOs
    })
    .refine(
        (data) =>
            [
                data.brand_name,
                data.revenue,
                data.deal_closed_value,
                data.contact_person_email,
                data.contact_person_name,
                data.contact_person_phone,
                data.ownerIds,
            ].some(Boolean),
        {
            message: "At least one field must be provided",
            path: [],
        }
    );

export const assignRoleSchema = z.object({
    userId: z.string().min(1, "User Id is required"),
    roleIds: z
        .array(z.number().positive())
        .min(1, "At least one role is required"),
});

export const contactSchema = z.object({
    contact_person_name: z.string().min(1, "Person name is required"),
    contact_person_phone: z.string().min(10, "Contact number is required"),
    contact_person_email: z.string().email("Valid email is required"),
});

export const paginationSchema = z.object({
    page: z
        .string()
        .or(z.number())
        .optional()
        .default("1")
        .transform((val) => Number(val))
        .refine((n) => n > 0, {
            message: "Page must be greater than 0",
        }),
    limit: z
        .string()
        .or(z.number())
        .optional()
        .default("10")
        .transform((val) => Number(val))
        .refine((n) => n > 0, {
            message: "Limit must be greater than 0",
        }),
});
