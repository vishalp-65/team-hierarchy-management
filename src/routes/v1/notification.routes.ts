import { Router } from "express";
import {
    deleteNotification,
    getUserNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from "../../controllers/notification.controller";

const router = Router();

// Get all notification related to current user
router.get("/", getUserNotifications);

// Mark all notification as read
router.patch("/readAll", markAllNotificationsRead);

// Mark notification as read
router.patch("/:notificationId", markNotificationRead);

// Delete notification
router.delete("/:notificationId", deleteNotification);

export default router;
