// src/services/sla.service.ts
import { Between, LessThan } from "typeorm";
import { Task } from "../entities/Task";
import { NotificationServiceInstance } from "./notification.service";
import AppDataSource from "../data-source";
import { TaskServiceInstance } from "./task.service";

class SLAService {
    async monitorSLAs(): Promise<void> {
        const taskRepo = AppDataSource.getRepository(Task);
        const now = new Date();

        // Tasks nearing due date (12 hours)
        const nearDueDate = new Date(now.getTime() + 12 * 60 * 60 * 1000);
        const tasksNearingDue = await taskRepo.find({
            where: {
                due_date: Between(now, nearDueDate),
                status: "open",
            },
            relations: ["creator", "assignee"],
        });

        for (const task of tasksNearingDue) {
            // Send notifications
            await NotificationServiceInstance.sendTaskNotification(
                task.creator,
                task,
                `Task "${task.title}" is nearing its due date.`
            );
            await NotificationServiceInstance.sendTaskNotification(
                task.assignee,
                task,
                `Task "${task.title}" is nearing its due date.`
            );
        }

        // Overdue tasks
        const overdueTasks = await taskRepo.find({
            where: {
                due_date: LessThan(now),
                status: "open",
            },
            relations: ["creator", "assignee"],
        });

        for (const task of overdueTasks) {
            // Update status to 'overdue'
            task.status = "overdue";
            await taskRepo.save(task);

            // Changing task status and add to history
            try {
                await TaskServiceInstance.updateTaskStatus(
                    task.id,
                    "overdue",
                    task.creator
                );
            } catch (error) {
                console.log("Unable to change status", error);
            }

            // Send notifications
            await NotificationServiceInstance.sendTaskNotification(
                task.creator,
                task,
                `Task "${task.title}" is now overdue.`
            );
        }
    }
}

export const SLAServiceInstance = new SLAService();
