import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
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

// Controller to get team owners based on role
export const getTeamOwnersByRole = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        let teamOwners: any;

        const userRoles = req.user.roles.map((role) => role.role_name);

        if (userRoles.includes("ADMIN") || userRoles.includes("MG")) {
            // ADMIN and MG have access to all team owners
            teamOwners = await teamService.getAllTeamOwners();
        } else {
            // For other roles, show only their authorized team owners
            teamOwners = await teamService.getAuthorizedTeamOwners(req.user.id);
        }
        sendResponse(
            res,
            httpStatus.OK,
            true,
            "Team owners fetch successfully",
            teamOwners
        );
    }
);
