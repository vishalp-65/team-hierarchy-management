import { Response } from "express";
import { userService } from "../services/user.service";
import { catchAsync } from "../utils/catchAsync";
import httpStatus from "http-status";
import { IGetUserAuthInfoRequest } from "../middlewares/auth.middleware";
import sendResponse from "../utils/responseHandler";
import { handleValidationErrors } from "../utils/errorHandler";
import { paginationSchema } from "../validations/reqValidations";

export const listTeammates = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userId = req.user.id;
        const teammates = await userService.listTeammates(userId);
        sendResponse(res, httpStatus.OK, true, "List of team mates", teammates);
    }
);

export const searchUser = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const searchTerm = req.query.q as string;
        console.log("search term", searchTerm);
        const users = await userService.searchUser(searchTerm, req.user.id);
        sendResponse(res, httpStatus.OK, true, "Filtered user", users);
    }
);

// Controller to get users based on role
export const getUsersByRole = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        let users: any;

        // Validate and parse options with Zod
        const parsedOptions = handleValidationErrors(
            paginationSchema.safeParse(req.query)
        );
        const { page, limit } = parsedOptions.data;

        const userRoles = req.user.roles.map((role) => role.role_name);

        if (userRoles.includes("ADMIN") || userRoles.includes("MG")) {
            // ADMIN and MG have access to all users
            users = await userService.getAllUsers(
                {
                    page: page,
                    limit: limit,
                },
                req.user.id
            );
        } else {
            // For TO, PO, BO, only show team-related or brand-related users
            users = await userService.getTeamAndBrandUsers(req.user.id);
        }
        sendResponse(
            res,
            httpStatus.OK,
            true,
            "Users fetched successfully",
            users
        );
    }
);
