import { Request, Response } from "express";
import { userService } from "../services/user.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { IGetUserAuthInfoRequest } from "../middlewares/auth.middleware";
import sendResponse from "../utils/responseHandler";

export const listTeammates = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userId = req.user.id;
        const teammates = await userService.listTeammates(userId);
        sendResponse(res, httpStatus.OK, true, "List of team mates", teammates);
    }
);

export const searchUser = catchAsync(async (req: Request, res: Response) => {
    const searchTerm = req.query.q as string;
    console.log("search term", searchTerm);
    const users = await userService.searchUser(searchTerm);
    sendResponse(res, httpStatus.OK, true, "Filtered user", users);
});
