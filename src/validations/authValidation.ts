import { z } from "zod";

export const loginUserSchema = z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password is required"),
});

export const changePasswordSchema = z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password is required"),
    newPassword: z.string().min(8, "newPassword is required"),
});
