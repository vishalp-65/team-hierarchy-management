// src/controllers/teamController.ts
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { teamService } from "../services/team.service";

export const getTeamHierarchy = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const hierarchy = await teamService.getTeamHierarchy(req.user.id);
        return res.status(200).json({ success: true, hierarchy });
    }
);
