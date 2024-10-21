import { Response } from "express";
import catchAsync from "../utils/catchAsync";
import { teamService } from "../services/team.service";
import httpStatus from "http-status";
import { IGetUserAuthInfoRequest } from "../middlewares/auth.middleware";
import sendResponse from "../utils/responseHandler";

export const getTeamHierarchy = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const hierarchy = await teamService.getTeamHierarchy(req.user.id);
        sendResponse(res, httpStatus.OK, true, "Team hierarchy", hierarchy);
    }
);
