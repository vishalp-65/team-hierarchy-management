// src/services/task.service.ts
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { Brand } from "../entities/Brand";
import { Inventory } from "../entities/Inventory";
import { TaskHistory } from "../entities/TaskHistory";
import { ApiError } from "../utils/ApiError";
import multer from "multer";
import httpStatus from "http-status";
import AppDataSource from "../data-source";
import { NotificationServiceInstance } from "./notification.service";
import { Event } from "../entities/Event";
import { TaskTypes } from "../types/types";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Comment } from "../entities/Comment";
import { Notification } from "../entities/Notification";

class TaskService {
    private notificationRepo: Repository<Notification>;
    private taskRepo: Repository<Task>;
    private userRepo: Repository<User>;
    private brandRepo: Repository<Brand>;
    private eventRepo: Repository<Event>;
    private historyRepo: Repository<TaskHistory>;
    private inventoryRepo: Repository<Inventory>;
    private commentRepo: Repository<Comment>;

    constructor() {
        this.userRepo = AppDataSource.getRepository(User);
        this.taskRepo = AppDataSource.getRepository(Task);
        this.brandRepo = AppDataSource.getRepository(Brand);
        this.eventRepo = AppDataSource.getRepository(Event);
        this.inventoryRepo = AppDataSource.getRepository(Inventory);
        this.historyRepo = AppDataSource.getRepository(TaskHistory);
        this.notificationRepo = AppDataSource.getRepository(Notification);
        this.commentRepo = AppDataSource.getRepository(Comment);
    }
    // Create a new task
    async createTask(data: TaskTypes, creator: User): Promise<Task> {
        // Fetch assignee
        const assignee = await this.userRepo.findOne({
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
                const brand = await this.brandRepo.findOne({
                    where: { id: data.brandId },
                });
                if (!brand)
                    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
                task.brand = brand;
                break;
            case "event":
                // Ensure to retrieve the full event entity
                const event = await this.eventRepo.findOne({
                    where: { id: data.eventId },
                    relations: ["tasks"],
                });
                if (!event)
                    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
                task.event = event; // Full event entity is now assigned here
                break;
            case "inventory":
                const inventory = await this.inventoryRepo.findOne({
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
        await this.taskRepo.save(task);

        // Log Task Creation in History
        const history = new TaskHistory();
        history.task = task;
        history.action = "Task Created";
        history.performed_by = creator;
        await this.historyRepo.save(history);

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
        const query = this.taskRepo
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
            this.applyTaskTypeFilter(query, filters.taskType, user);
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
            const teamMemberIds = await this.getTeamOwnerIds(user);
            if (teamMemberIds.length > 0) {
                query.andWhere("task.assigneeId IN (:...teamMemberIds)", {
                    teamMemberIds,
                });
            }
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

    private async applyTaskTypeFilter(
        query: SelectQueryBuilder<Task>,
        taskType: string,
        user: User
    ) {
        switch (taskType) {
            case "your":
                query.andWhere("task.assigneeId = :userId", {
                    userId: user.id,
                });
                break;
            case "team":
                const teamMemberIds = await this.getTeamOwnerIds(user);
                if (teamMemberIds.length > 0) {
                    query.andWhere("task.assigneeId IN (:...teamMemberIds)", {
                        teamMemberIds,
                    });
                }
                break;
            case "delegated":
                query.andWhere("task.creatorId = :userId", { userId: user.id });
                break;
            default:
                break;
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
        // Ensure children is an array before mapping
        if (!user.children || user.children.length === 0) {
            return []; // Return an empty array if no children are found
        }
        return user.children.map((child) => child.id);
    }

    async updateTaskStatus(
        taskId: string,
        status: string,
        user: User
    ): Promise<Task> {
        const task = await this.taskRepo.findOne({
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
        await this.taskRepo.save(task);

        // Log in history
        const history = new TaskHistory();
        history.task = task;
        history.action = `Status changed to ${status}`;
        history.performed_by = user;
        await this.historyRepo.save(history);

        return task;
    }

    // Edit task (title, description, due_date)
    async editTask(
        taskId: string,
        data: Partial<TaskTypes>,
        user: User
    ): Promise<Task> {
        // Find task with creator and assignee
        const task = await this.taskRepo.findOne({
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
        await this.taskRepo.save(task);

        // Log the changes in history
        const history = new TaskHistory();
        history.task = task;
        history.action = "Task updated";
        history.performed_by = user;
        history.action = this.getChangedFields(data, task); // Helper function to log changes
        await this.historyRepo.save(history);

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
        // Find the task with relations
        const task = await this.taskRepo.findOne({
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
        await this.notificationRepo
            .createQueryBuilder()
            .delete()
            .where("taskId = :taskId", { taskId: task.id })
            .execute();

        // Delete related comments
        await this.commentRepo
            .createQueryBuilder()
            .delete()
            .where("taskId = :taskId", { taskId: task.id })
            .execute();

        // Delete related task history
        await this.historyRepo
            .createQueryBuilder()
            .delete()
            .where("taskId = :taskId", { taskId: task.id })
            .execute();

        // Delete the task itself
        await this.taskRepo.delete(task.id);

        return;
    }

    // Add comment on a Task
    async addComment(
        taskId: string,
        content: string,
        user: User,
        file?: Express.Multer.File
    ): Promise<Comment> {
        const task = await this.taskRepo.findOne({
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

        // Handle file upload
        if (file) {
            comment.file_path = file.path; // Store the file path
        }

        await this.commentRepo.save(comment);

        // Log in history
        const history = new TaskHistory();
        history.task = task;
        history.action = "Comment Added";
        history.performed_by = user;
        await this.historyRepo.save(history);

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

    // Get task History
    async getTaskHistory(taskId: string): Promise<TaskHistory[]> {
        const history = await this.historyRepo.find({
            where: { task: { id: taskId } },
            relations: ["performed_by"],
            order: { timestamp: "ASC" },
        });
        return history;
    }
}

export const TaskServiceInstance = new TaskService();
