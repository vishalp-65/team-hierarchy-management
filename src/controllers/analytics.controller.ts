// src/controllers/analytics.controller.ts
import { Request, Response } from "express";
import { AnalyticsServiceInstance } from "../services/analytics.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { z } from "zod";
import sendResponse from "../utils/responseHandler";

// Get task analytics
export const getTaskAnalytics = catchAsync(
    async (req: Request, res: Response) => {
        const { timeframe } = req.query;

        const timeframeSchema = z.enum([
            "today",
            "last3days",
            "last7days",
            "last15days",
            "lastmonth",
            "thismonth",
            "alltime",
        ]);

        const parsed = timeframeSchema.safeParse(timeframe);
        if (!parsed.success) {
            sendResponse(
                res,
                httpStatus.BAD_REQUEST,
                false,
                "Invalid timeframe"
            );
        }

        const analytics = await AnalyticsServiceInstance.getTaskAnalytics(
            parsed.data
        );
        sendResponse(res, httpStatus.OK, true, "Analytics data", analytics);
    }
);
