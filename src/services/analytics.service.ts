// src/services/analytics.service.ts
import { Task } from "../entities/Task";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";
import AppDataSource from "../data-source";
import { Between } from "typeorm";
import {
    generateCacheKey,
    getFromCache,
    setCache,
} from "../utils/cacheHandler";

class AnalyticsService {
    async getTaskAnalytics(timeFrame: string, userId: string): Promise<any> {
        // Generate a unique cache key based on user ID and filters
        const cacheKey = generateCacheKey("analytics", userId, {
            timeFrame,
        });

        // Check if tasks are in cache
        const cachedAnalytics = await getFromCache<any>(cacheKey);
        if (cachedAnalytics) {
            return cachedAnalytics; // Return cached result if exists
        }

        const taskRepo = AppDataSource.getRepository(Task);
        const now = new Date();
        let startDate: Date;

        switch (timeFrame) {
            case "today":
                startDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate()
                );
                break;
            case "last3days":
                startDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - 3
                );
                break;
            case "last7days":
                startDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - 7
                );
                break;
            case "last15days":
                startDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - 15
                );
                break;
            case "lastmonth":
                startDate = new Date(
                    now.getFullYear(),
                    now.getMonth() - 1,
                    now.getDate()
                );
                break;
            case "thismonth":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "alltime":
                startDate = new Date(0); // Epoch
                break;
            default:
                throw new ApiError(httpStatus.BAD_REQUEST, "Invalid timeFrame");
        }

        const totalTasksCreated = await taskRepo.count({
            where: {
                created_at:
                    timeFrame !== "alltime"
                        ? Between(startDate, now)
                        : undefined,
            },
        });

        const openTasks = await taskRepo.count({
            where: {
                status: "open",
                created_at:
                    timeFrame !== "alltime"
                        ? Between(startDate, now)
                        : undefined,
            },
        });

        const completedTasks = await taskRepo.count({
            where: {
                status: "completed",
                created_at:
                    timeFrame !== "alltime"
                        ? Between(startDate, now)
                        : undefined,
            },
        });

        const overdueTasks = await taskRepo.count({
            where: {
                status: "overdue",
                created_at:
                    timeFrame !== "alltime"
                        ? Between(startDate, now)
                        : undefined,
            },
        });

        // Cache the result
        await setCache(
            cacheKey,
            { totalTasksCreated, openTasks, completedTasks, overdueTasks },
            3600
        ); // Cache for 1 hour

        return {
            totalTasksCreated,
            openTasks,
            completedTasks,
            overdueTasks,
        };
    }
}

export const AnalyticsServiceInstance = new AnalyticsService();
