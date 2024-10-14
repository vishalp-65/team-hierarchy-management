// src/services/notification.service.ts
import { Notification } from "../entities/Notification";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import AppDataSource from "../data-source";

class NotificationService {
    async sendTaskNotification(
        recipient: User,
        task: Task,
        content: string
    ): Promise<void> {
        const notificationRepo = AppDataSource.getRepository(Notification);

        const notification = new Notification();
        notification.recipient = recipient;
        notification.task = task;
        notification.content = content;
        notification.is_read = false;

        await notificationRepo.save(notification);
    }

    async getUserNotifications(user: User): Promise<Notification[]> {
        const notificationRepo = AppDataSource.getRepository(Notification);
        return await notificationRepo.find({
            where: { recipient: { id: user.id } },
            order: { created_at: "DESC" },
        });
    }
}

export const NotificationServiceInstance = new NotificationService();
