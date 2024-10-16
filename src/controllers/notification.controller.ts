import { Request, Response } from "express";
import { NotificationServiceInstance } from "../services/notification.service";
import httpStatus from "http-status";
import { IGetUserAuthInfoRequest } from "../middlewares/auth.middleware";
import { z } from "zod";
import { paginationSchema } from "../validations/reqValidations";

// Fetch notifications
export async function getUserNotifications(
    req: IGetUserAuthInfoRequest,
    res: Response
) {
    // Validate and parse options with Zod
    const parsedOptions = paginationSchema.safeParse(req.params);

    if (!parsedOptions.success) {
        const error = parsedOptions.error.errors
            .map((e) => e.message)
            .join(", ");
        res.status(httpStatus.BAD_REQUEST).json({ success: false, error });
    }

    const { page, limit } = parsedOptions.data;

    const notifications =
        await NotificationServiceInstance.getNotificationsForUser(req.user.id, {
            page: Number(page),
            limit: Number(limit),
        });
    res.status(httpStatus.OK).json({ success: true, notifications });
}

// Mark notification as read
export async function markNotificationRead(
    req: IGetUserAuthInfoRequest,
    res: Response
) {
    const { notificationId } = req.params;
    await NotificationServiceInstance.markAsRead(req.user.id, notificationId);
    res.status(httpStatus.NO_CONTENT).send();
}

// Mark all notifications as read
export async function markAllNotificationsRead(
    req: IGetUserAuthInfoRequest,
    res: Response
) {
    await NotificationServiceInstance.markAllAsRead(req.user.id);
    res.status(httpStatus.NO_CONTENT).send();
}

// Delete notification
export async function deleteNotification(
    req: IGetUserAuthInfoRequest,
    res: Response
) {
    const { notificationId } = req.params;
    await NotificationServiceInstance.deleteNotification(
        req.user.id,
        notificationId
    );
    res.status(httpStatus.NO_CONTENT).send();
}
