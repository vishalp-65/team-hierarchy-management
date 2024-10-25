import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import AppDataSource from "../data-source";
import { User } from "../entities/User";
import httpStatus from "http-status";
import { Task } from "../entities/Task";
import { verifyToken } from "../utils/authUtils";
import { Socket } from "socket.io";

export interface IGetUserAuthInfoRequest extends Request {
    user: User;
}

// Role-based authorization middleware
export const authorizeRoles =
    (roles: string[]) =>
    (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
        const userRoles = req.user.roles.map((role: any) => role.role_name);
        const hasRole = roles.some((role) => userRoles.includes(role));

        if (!hasRole) {
            return next(
                new ApiError(
                    httpStatus.FORBIDDEN,
                    "Access to this resource is forbidden"
                )
            );
        }
        next();
    };

// Express authentication middleware
export const authentication = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const token = getTokenFromHeader(req);
    if (!token) {
        return next(
            new ApiError(
                httpStatus.UNAUTHORIZED,
                "Authorization header missing"
            )
        );
    }

    await authenticateUser(token, req, res, next);
};

// Socket authentication middleware
export const authenticateSocket = async (socket: Socket, next: any) => {
    const token = socket.handshake.query.token as string;
    if (!token) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid Token"));
    }

    await authenticateUser(token, null, null, next, socket);
};

// Permission check for tasks - Express
export const checkTaskPermissions = async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
) => {
    const taskId = req.params.taskId;
    const user = req.user;

    const task = await findTask(taskId);
    if (!task) {
        return res
            .status(httpStatus.NOT_FOUND)
            .json({ success: false, message: "Task not found" });
    }

    if (hasTaskPermission(task, user)) {
        return next();
    }

    res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "You do not have permission to access this task",
    });
};

// Permission check for tasks - Socket
export const checkTaskPermissionsSocket = async (
    socket: Socket,
    taskId: string,
    next: any
) => {
    const user = socket.data.user;
    const task = await findTask(taskId);

    if (!task) {
        return next(new ApiError(httpStatus.NOT_FOUND, "Task not found"));
    }

    if (hasTaskPermission(task, user)) {
        return next();
    }

    next(new ApiError(httpStatus.FORBIDDEN, "Permission denied"));
};

// Helper: Token extraction from headers
const getTokenFromHeader = (req: Request): string | null => {
    const header = req.headers["authorization"];
    return header ? header.split(" ")[1] : null;
};

// Helper: User authentication
const authenticateUser = async (
    token: string,
    req: Request | null,
    res: Response | null,
    next: NextFunction,
    socket?: Socket
): Promise<void> => {
    try {
        const decodedToken = verifyToken(token) as { id: string };
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: decodedToken.id },
            relations: ["roles"],
        });

        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
        }

        if (req) {
            (req as any).user = user;
        } else if (socket) {
            socket.data.user = user;
        }

        next();
    } catch (error) {
        next(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized"));
    }
};

// Helper: Find a task by ID
const findTask = async (taskId: string): Promise<Task | null> => {
    const taskRepo = AppDataSource.getRepository(Task);
    return taskRepo.findOne({
        where: { id: taskId },
        relations: ["creator", "assignee"],
    });
};

// Helper: Task permission check
const hasTaskPermission = (task: Task, user: User): boolean => {
    const userRoles = user.roles.map((role) => role.role_name);

    if (userRoles.includes("ADMIN") || userRoles.includes("MG")) {
        return true; // Admins and Managers have full access
    }

    if (userRoles.includes("TO")) {
        // Team Owners can access their team members' tasks
        return task.assignee?.team?.teamOwner?.id === user.id;
    }

    if (userRoles.includes("PO") || userRoles.includes("BO")) {
        // Project Owners and Brand Owners can access their own and delegated tasks
        return task.creator.id === user.id || task.assignee.id === user.id;
    }

    // Regular users can access their own and delegated tasks
    return task.creator.id === user.id || task.assignee.id === user.id;
};
