import { Response } from "express";
import catchAsync from "../utils/catchAsync";
import { teamService } from "../services/team.service";
import httpStatus from "http-status";
import { IGetUserAuthInfoRequest } from "../middlewares/auth.middleware";

export const getTeamHierarchy = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const hierarchy = await teamService.getTeamHierarchy(req.user.id);
        return res.status(httpStatus.OK).json({ success: true, hierarchy });
    }
);
