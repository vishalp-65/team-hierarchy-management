import { Response } from "express";
import { NotificationServiceInstance } from "../services/notification.service";
import httpStatus from "http-status";
import { IGetUserAuthInfoRequest } from "../middlewares/auth.middleware";
import { paginationSchema } from "../validations/reqValidations";
import { handleValidationErrors } from "../utils/errorHandler";
import sendResponse from "../utils/responseHandler";
import { catchAsync } from "../utils/catchAsync";

// Fetch notifications
export const getUserNotifications = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        // Validate and parse options with Zod
        const parsedOptions = handleValidationErrors(
            paginationSchema.safeParse(req.query)
        );

        const { page, limit } = parsedOptions.data;

        const notifications =
            await NotificationServiceInstance.getNotificationsForUser(
                req.user.id,
                {
                    page: page,
                    limit: limit,
                }
            );
        sendResponse(
            res,
            httpStatus.OK,
            true,
            "User notification",
            notifications
        );
    }
);

// Mark notification as read
export const markNotificationRead = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { notificationId } = req.params;
        await NotificationServiceInstance.markAsRead(
            req.user.id,
            notificationId
        );
        sendResponse(res, httpStatus.NO_CONTENT, true, "Marked as read");
    }
);

// Mark all notifications as read
export const markAllNotificationsRead = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        await NotificationServiceInstance.markAllAsRead(req.user.id);
        sendResponse(res, httpStatus.NO_CONTENT, true, "Marked all as read");
    }
);

// Delete notification
export const deleteNotification = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { notificationId } = req.params;
        await NotificationServiceInstance.deleteNotification(
            req.user.id,
            notificationId
        );
        sendResponse(res, httpStatus.NO_CONTENT, true, "Notification deleted");
    }
);
