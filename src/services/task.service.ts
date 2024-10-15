// src/services/task.service.ts
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { Brand } from "../entities/Brand";
import { Inventory } from "../entities/Inventory";
import { TaskHistory } from "../entities/TaskHistory";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";
import AppDataSource from "../data-source";
import { NotificationServiceInstance } from "./notification.service";
import { Event } from "../entities/Event";
import { TaskTypes } from "../types/types";
import { SelectQueryBuilder } from "typeorm";
import { Comment } from "../entities/Comment";
import { Notification } from "../entities/Notification";

class TaskService {
    // Create a new task
    async createTask(data: TaskTypes, creator: User): Promise<Task> {
        const taskRepo = AppDataSource.getRepository(Task);
        const userRepo = AppDataSource.getRepository(User);
        const brandRepo = AppDataSource.getRepository(Brand);
        const eventRepo = AppDataSource.getRepository(Event);
        const inventoryRepo = AppDataSource.getRepository(Inventory);
        const historyRepo = AppDataSource.getRepository(TaskHistory);

        // Fetch assignee
        const assignee = await userRepo.findOne({
            where: { id: data.assigneeId },
        });
        if (!assignee) {
            throw new ApiError(httpStatus.NOT_FOUND, "Assignee not found");
        }

        // Initialize Task
        const task = new Task();
        task.title = data.title;
        task.description = data.description || "";
        task.task_type = data.task_type;
        task.due_date = data.due_date ? new Date(data.due_date) : null;
        task.creator = creator;
        task.assignee = assignee;

        // Assign related entity based on task_type
        switch (data.task_type) {
            case "brand":
                const brand = await brandRepo.findOne({
                    where: { id: data.brandId },
                });
                if (!brand)
                    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
                task.brand = brand;
                break;
            case "event":
                // Ensure to retrieve the full event entity
                const event = await eventRepo.findOne({
                    where: { id: data.eventId },
                    relations: ["tasks"],
                });
                if (!event)
                    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
                task.event = event; // Full event entity is now assigned here
                break;
            case "inventory":
                const inventory = await inventoryRepo.findOne({
                    where: { id: data.inventoryId },
                });
                if (!inventory)
                    throw new ApiError(
                        httpStatus.NOT_FOUND,
                        "Inventory not found"
                    );
                task.inventory = inventory;
                break;
            default:
                break;
        }

        // Save Task
        await taskRepo.save(task);

        // Log Task Creation in History
        const history = new TaskHistory();
        history.task = task;
        history.action = "Task Created";
        history.performed_by = creator;
        await historyRepo.save(history);

        // Send Notification to Assignee
        await NotificationServiceInstance.sendTaskNotification(
            assignee,
            task,
            `A new task "${task.title}" has been assigned to you.`
        );

        return task;
    }

    // Get all task with filter and sorting functionality
    async getTasks(user: User, filters: any): Promise<Task[]> {
        const taskRepo = AppDataSource.getRepository(Task);

        const query = taskRepo
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.creator", "creator")
            .leftJoinAndSelect("task.assignee", "assignee")
            .leftJoinAndSelect("task.brand", "brand")
            .leftJoinAndSelect("task.event", "event")
            .leftJoinAndSelect("task.inventory", "inventory")
            .leftJoinAndSelect("task.comments", "comments")
            .leftJoinAndSelect("comments.author", "commentAuthor")
            .leftJoinAndSelect("task.history", "history")
            .leftJoinAndSelect("history.performed_by", "historyUser");

        console.log("query");
        // Apply Role-based Access Control
        this.applyRBAC(query, user);
        console.log("query2");
        // Apply Filters
        this.applyFilters(query, filters, user);
        console.log("query3");
        // Apply Sorting
        this.applySorting(query, filters);
        console.log("query4");
        return query.getMany();
    }

    private applyRBAC(query: SelectQueryBuilder<Task>, user: User) {
        const userRoles = user.roles.map((role) => role.role_name);

        if (userRoles.includes("ADMIN") || userRoles.includes("MG")) {
            // Admin and Management can view all tasks
            return;
        } else if (userRoles.includes("TO")) {
            // Team Owners can see their team members' tasks
            const teamMemberIds = user.children?.map((child) => child.id) || [];

            // If no team members, avoid IN clause with empty array
            if (teamMemberIds.length > 0) {
                query.where("task.assigneeId IN (:...teamMemberIds)", {
                    teamMemberIds,
                });
            } else {
                // Handle case where TO has no team members
                query.where("1 = 0"); // No tasks will be selected
            }
        } else if (userRoles.includes("PO") || userRoles.includes("BO")) {
            // Project Owners and Brand Owners can see their own and delegated tasks
            query.where(
                "task.assigneeId = :userId OR task.creatorId = :userId",
                { userId: user.id }
            );
        } else {
            // Regular users can see their own and delegated tasks
            query.where(
                "task.assigneeId = :userId OR task.creatorId = :userId",
                { userId: user.id }
            );
        }
    }

    private async applyFilters(
        query: SelectQueryBuilder<Task>,
        filters: any,
        user: User
    ) {
        if (filters.taskType) {
            query.andWhere("task.task_type = :taskType", {
                taskType: filters.taskType,
            });
        }
        if (filters.assignedBy) {
            query.andWhere("creator.id = :assignedBy", {
                assignedBy: filters.assignedBy,
            });
        }
        if (filters.assignedTo) {
            query.andWhere("assignee.id = :assignedTo", {
                assignedTo: filters.assignedTo,
            });
        }
        if (filters.teamOwner) {
            const teamOwnerIds = await this.getTeamOwnerIds(user);
            query.andWhere("task.assigneeId IN (:...teamOwnerIds)", {
                teamOwnerIds,
            });
        }
        if (filters.dueDatePassed) {
            query.andWhere("task.due_date < :now", { now: new Date() });
        }
        if (filters.brandName) {
            query.andWhere("brand.brand_name LIKE :brandName", {
                brandName: `%${filters.brandName}%`,
            });
        }
        if (filters.inventoryName) {
            query.andWhere("inventory.name LIKE :inventoryName", {
                inventoryName: `%${filters.inventoryName}%`,
            });
        }
        if (filters.eventName) {
            query.andWhere("event.name LIKE :eventName", {
                eventName: `%${filters.eventName}%`,
            });
        }
    }

    private applySorting(query: SelectQueryBuilder<Task>, filters: any) {
        if (filters.sortBy && filters.order) {
            query.orderBy(
                `task.${filters.sortBy}`,
                filters.order.toUpperCase() as "ASC" | "DESC"
            );
        }
    }

    private async getTeamOwnerIds(user: User): Promise<string[]> {
        // TODO: Implement multilevel TO visibility logic
        // For simplicity, returning team members' IDs
        return user.children.map((child) => child.id);
    }

    async updateTaskStatus(
        taskId: string,
        status: string,
        user: User
    ): Promise<Task> {
        const taskRepo = AppDataSource.getRepository(Task);
        const historyRepo = AppDataSource.getRepository(TaskHistory);

        const task = await taskRepo.findOne({
            where: { id: taskId },
            relations: ["creator", "assignee"],
        });
        if (!task) {
            throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
        }

        // Only assignee can mark as completed
        if (status === "completed" && task.assignee.id !== user.id) {
            throw new ApiError(
                httpStatus.FORBIDDEN,
                "Only assignee can mark the task as completed"
            );
        }

        task.status = status;
        await taskRepo.save(task);

        // Log in history
        const history = new TaskHistory();
        history.task = task;
        history.action = `Status changed to ${status}`;
        history.performed_by = user;
        await historyRepo.save(history);

        return task;
    }

    // Edit task (title, description, due_date)
    async editTask(
        taskId: string,
        data: Partial<TaskTypes>,
        user: User
    ): Promise<Task> {
        const taskRepo = AppDataSource.getRepository(Task);
        const historyRepo = AppDataSource.getRepository(TaskHistory);

        // Find task with creator and assignee
        const task = await taskRepo.findOne({
            where: { id: taskId },
            relations: ["creator", "assignee"],
        });

        if (!task) {
            throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
        }

        // Only the creator can edit the task
        if (task.creator.id !== user.id) {
            throw new ApiError(
                httpStatus.FORBIDDEN,
                "Only the task creator can edit the task"
            );
        }

        // Prevent task type change after creation
        if (data.task_type && data.task_type !== task.task_type) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "Cannot change task type after creation"
            );
        }

        // Update only fields that have been modified
        if (data.title && data.title !== task.title) {
            task.title = data.title;
        }
        if (data.description && data.description !== task.description) {
            task.description = data.description;
        }
        if (data.due_date && new Date(data.due_date) !== task.due_date) {
            task.due_date = new Date(data.due_date);
        }

        // Save the updated task
        await taskRepo.save(task);

        // Log the changes in history
        const history = new TaskHistory();
        history.task = task;
        history.action = "Task updated";
        history.performed_by = user;
        history.action = this.getChangedFields(data, task); // Helper function to log changes
        await historyRepo.save(history);

        return task;
    }

    // Helper to track changed fields
    private getChangedFields(newData: Partial<TaskTypes>, task: Task): string {
        const changes: string[] = [];
        if (newData.title && newData.title !== task.title) {
            changes.push("title");
        }
        if (newData.description && newData.description !== task.description) {
            changes.push("description");
        }
        if (newData.due_date && new Date(newData.due_date) !== task.due_date) {
            changes.push("due_date");
        }
        return changes.join(", ");
    }

    // Delete task
    async deleteTask(taskId: string, user: User): Promise<void> {
        const taskRepo = AppDataSource.getRepository(Task);
        const historyRepo = AppDataSource.getRepository(TaskHistory);
        const commentRepo = AppDataSource.getRepository(Comment);
        const notificationRepo = AppDataSource.getRepository(Notification);

        // Find the task with relations
        const task = await taskRepo.findOne({
            where: { id: taskId },
            relations: ["creator", "assignee", "comments", "history"],
        });

        if (!task) {
            throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
        }

        // Only the creator can delete the task
        if (task.creator.id !== user.id) {
            throw new ApiError(
                httpStatus.FORBIDDEN,
                "Only the task creator can delete the task"
            );
        }

        // Delete related notifications
        await notificationRepo
            .createQueryBuilder()
            .delete()
            .where("taskId = :taskId", { taskId: task.id })
            .execute();

        // Delete related comments
        await commentRepo
            .createQueryBuilder()
            .delete()
            .where("taskId = :taskId", { taskId: task.id })
            .execute();

        // Delete related task history
        await historyRepo
            .createQueryBuilder()
            .delete()
            .where("taskId = :taskId", { taskId: task.id })
            .execute();

        // Delete the task itself
        await taskRepo.delete(task.id);

        return;
    }

    // Add comment on a Task
    async addComment(
        taskId: string,
        content: string,
        user: User
    ): Promise<Comment> {
        const taskRepo = AppDataSource.getRepository(Task);
        const commentRepo = AppDataSource.getRepository(Comment);
        const historyRepo = AppDataSource.getRepository(TaskHistory);

        const task = await taskRepo.findOne({
            where: { id: taskId },
            relations: ["creator", "assignee"],
        });
        if (!task) {
            throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
        }

        const comment = new Comment();
        comment.content = content;
        comment.task = task;
        comment.author = user;

        await commentRepo.save(comment);

        // Log in history
        const history = new TaskHistory();
        history.task = task;
        history.action = "Comment Added";
        history.performed_by = user;
        await historyRepo.save(history);

        // Notify relevant users
        await NotificationServiceInstance.sendTaskNotification(
            task.creator,
            task,
            `${user.user_name} commented on task "${task.title}".`
        );

        if (task.assignee.id !== user.id) {
            await NotificationServiceInstance.sendTaskNotification(
                task.assignee,
                task,
                `${user.user_name} commented on your task "${task.title}".`
            );
        }

        return comment;
    }
}

export const TaskServiceInstance = new TaskService();
