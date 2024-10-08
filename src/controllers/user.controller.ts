import { Request, Response } from "express";
import { userService } from "../services/user.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";

export const listTeammates = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const teammates = await userService.listTeammates(userId);
    res.status(httpStatus.OK).json({ success: true, teammates });
});

export const searchUser = catchAsync(async (req: Request, res: Response) => {
    const searchTerm = req.query.q as string;
    console.log("search term", searchTerm);
    const users = await userService.searchUser(searchTerm);
    res.status(httpStatus.OK).json({ success: true, users });
});
