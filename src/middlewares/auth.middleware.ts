// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import AppDataSource from "../data-source";
import { User } from "../entities/User";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";

// Middleware to check if user is admin
export const checkAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id; // Assuming userId is set by authentication middleware
        console.log("user id", userId);
        const userRepo = AppDataSource.getRepository(User);

        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["roles"],
        });

        if (!user || !user.roles.some((role) => role.role_name === "ADMIN")) {
            throw new ApiError(
                httpStatus.FORBIDDEN,
                "Access denied, Admins only"
            );
        }

        next();
    }
);

// Middleware for role-based authorization
export const checkRole = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id; // Assuming userId is set by authentication middleware
        const userRepo = AppDataSource.getRepository(User);

        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["roles"],
        });

        if (
            !user ||
            !user.roles.some((role) => roles.includes(role.role_name))
        ) {
            throw new ApiError(
                httpStatus.FORBIDDEN,
                "Access denied, insufficient permissions"
            );
        }

        next();
    };
};

export const authentication = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const header = req.headers["authorization"];

        if (!header) {
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json({ error: "Authorization header missing" });
        }

        const token = header.split(" ")[1];
        console.log("token", token);

        if (!token) {
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json({ message: "Invalid Token" });
        }

        req.user = req.user || {}; // This should now work
        req.user.id = token;

        console.log(req.user); // Verify that `req.user` exists at runtime

        next();
    }
);
