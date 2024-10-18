// src/controllers/analytics.controller.ts
import { Request, Response } from "express";
import { AnalyticsServiceInstance } from "../services/analytics.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { z } from "zod";
import { ApiError } from "../utils/ApiError";

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
            res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "Invalid timeframe",
            });
        }

        const analytics = await AnalyticsServiceInstance.getTaskAnalytics(
            parsed.data
        );
        res.status(httpStatus.OK).json({ success: true, analytics });
    }
);
