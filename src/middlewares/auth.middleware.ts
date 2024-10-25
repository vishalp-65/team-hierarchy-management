import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import AppDataSource from "../data-source";
import { User } from "../entities/User";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { Task } from "../entities/Task";
import { verifyToken } from "../utils/authUtils";

export interface IGetUserAuthInfoRequest extends Request {
    user: User; // or any other type
}

export const authorizeRoles = (roles: string[]) => {
    return (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) => {
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

export const authentication = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const header = req.headers["authorization"];
        if (!header) {
            throw new ApiError(
                httpStatus.UNAUTHORIZED,
                "Authorization header missing"
            );
        }

        const token = header.split(" ")[1]; // Expect "Bearer <token>"
        if (!token) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Token");
        }

        // Verify and decode the JWT token
        const decodedToken = verifyToken(token) as { id: string };
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: decodedToken.id },
            relations: ["roles"],
        });

        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
        }

        // Attach the full user object to the request
        (req as any).user = user;
        next();
    } catch (error) {
        next(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized"));
    }
};

export const checkTaskPermissions = async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
) => {
    const { taskId } = req.params;
    const user = req.user;

    const taskRepo = AppDataSource.getRepository(Task);
    const task = await taskRepo.findOne({
        where: { id: taskId },
        relations: ["creator", "assignee"],
    });

    if (!task) {
        return res
            .status(httpStatus.NOT_FOUND)
            .json({ success: false, message: "Task not found" });
    }

    const userRoles = user.roles.map((role) => role.role_name);

    if (userRoles.includes("ADMIN") || userRoles.includes("MG")) {
        // Admin and Management have full access
        return next();
    }

    if (userRoles.includes("TO")) {
        // Team Owners can access their team members' tasks
        if (task.assignee.team && task.assignee.team.teamOwner.id === user.id) {
            return next();
        }
    }

    if (userRoles.includes("PO") || userRoles.includes("BO")) {
        // Project Owners and Brand Owners can access their own and delegated tasks
        if (task.creator.id === user.id || task.assignee.id === user.id) {
            return next();
        }
    }

    // Regular users can access their own and delegated tasks
    if (task.creator.id === user.id || task.assignee.id === user.id) {
        return next();
    }

    return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "You do not have permission to access this task",
    });
};
