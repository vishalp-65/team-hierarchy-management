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

class TaskService {
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

        // Apply Role-based Access Control
        this.applyRBAC(query, user);

        // Apply Filters
        this.applyFilters(query, filters, user);

        // Apply Sorting
        this.applySorting(query, filters);

        return query.getMany();
    }

    private applyRBAC(query: SelectQueryBuilder<Task>, user: User) {
        const userRoles = user.roles.map((role) => role.role_name);

        if (userRoles.includes("ADMIN") || userRoles.includes("MG")) {
            // Admin and Management can view all tasks
            return;
        } else if (userRoles.includes("TO")) {
            // Team Owners can see their team members' tasks
            query.where("task.assigneeId IN (:...teamMemberIds)", {
                teamMemberIds: user.children.map((child) => child.id),
            });
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
        // Implement multilevel TO visibility logic
        // For simplicity, returning team members' IDs
        return user.children.map((child) => child.id);
    }
}

export const TaskServiceInstance = new TaskService();
