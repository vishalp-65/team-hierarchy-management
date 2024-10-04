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

export const authorizeRoles = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRoles = req.user.roles.map((role: any) => role.role_name);
        const hasRole = roles.some((role) => userRoles.includes(role));

        if (!hasRole) {
            return next(
                new ApiError(
                    httpStatus.FORBIDDEN,
                    "You are not authorized to access this resource"
                )
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

        const token = header.split(" ")[1]; // Assuming the format "Bearer <token>"

        if (!token) {
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json({ message: "Invalid Token" });
        }

        try {
            // Assuming the token is user_id itself, no decoding is necessary
            const userId = parseInt(token); // In a real-world scenario, we'll verify the token (JWT, etc.)

            // Fetch the full user from the database
            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOne({
                where: { id: userId },
                relations: ["roles"], // Include related roles or any other relations you need
            });

            if (!user) {
                return res
                    .status(httpStatus.UNAUTHORIZED)
                    .json({ error: "User not found" });
            }

            // Attach the full user object to the request
            req.user = user;

            console.log(req.user); // Verify that `req.user` contains the full user object

            next();
        } catch (error) {
            console.error(error);
            return next(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized"));
        }
    }
);
