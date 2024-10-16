// src/services/notification.service.ts
import { Notification } from "../entities/Notification";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import AppDataSource from "../data-source";
import { Repository } from "typeorm";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";

class NotificationService {
    private notificationRepo: Repository<Notification>;

    constructor() {
        this.notificationRepo = AppDataSource.getRepository(Notification);
    }
    async sendTaskNotification(
        recipient: User,
        task: Task,
        content: string
    ): Promise<void> {
        const notification = new Notification();
        notification.recipient = recipient;
        notification.task = task;
        notification.content = content;
        notification.is_read = false;

        await this.notificationRepo.save(notification);
    }

    // Fetch notifications for a user (with pagination, sorting)
    async getNotificationsForUser(
        userId: string,
        options: { page?: number; limit?: number } = {}
    ): Promise<Notification[]> {
        const { page = 1, limit = 10 } = options;
        return await this.notificationRepo.find({
            where: { recipient: { id: userId } },
            relations: ["task", "recipient"],
            order: { created_at: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    // Mark a notification as read
    async markAsRead(userId: string, notificationId: string): Promise<void> {
        const notification = await this.notificationRepo.findOne({
            where: { id: notificationId },
            relations: ["recipient"],
        });
        if (!notification) {
            throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
        }
        if (notification?.recipient?.id !== userId) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
        }
        notification.is_read = true;
        await this.notificationRepo.save(notification);
    }

    // Mark all notifications as read for a user
    async markAllAsRead(userId: string): Promise<void> {
        const notifications = await this.notificationRepo.find({
            where: { recipient: { id: userId }, is_read: false },
        });

        if (!notifications) {
            throw new ApiError(httpStatus.NOT_FOUND, "Notifications not found");
        }
        for (const notification of notifications) {
            notification.is_read = true;
        }

        await this.notificationRepo.save(notifications);
    }

    // Delete a notification
    async deleteNotification(
        userId: string,
        notificationId: string
    ): Promise<void> {
        const notification = await this.notificationRepo.findOne({
            where: { id: notificationId },
            relations: ["recipient"],
        });
        if (!notification) {
            throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
        }
        if (notification.recipient.id !== userId) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
        }
        await this.notificationRepo.delete(notification.id);
    }
}

export const NotificationServiceInstance = new NotificationService();
