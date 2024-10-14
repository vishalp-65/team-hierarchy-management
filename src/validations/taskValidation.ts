// src/validations/task.validation.ts
import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    task_type: z.enum(["general", "brand", "event", "inventory"]),
    due_date: z.string().optional(), // ISO date string
    assigneeId: z.string().min(1, "Comment content is required"),
    brandId: z.string().optional(),
    eventId: z.string().optional(),
    inventoryId: z.string().optional(),
});

export const getTasksSchema = z.object({
    taskType: z.enum(["all", "your", "team", "delegated"]).optional(),
    assignedBy: z.string().optional(),
    assignedTo: z.string().optional(),
    teamOwner: z.string().optional(),
    dueDatePassed: z.boolean().optional(),
    brandName: z.string().optional(),
    inventoryName: z.string().optional(),
    eventName: z.string().optional(),
    sortBy: z.enum(["title", "due_date", "status"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
});

export const updateTaskStatusSchema = z.object({
    status: z.enum(["open", "in-progress", "completed", "overdue"]),
});

export const addCommentSchema = z.object({
    content: z.string().min(1, "Comment content is required"),
});

class TaskValidation {
    createTask(data: any) {
        return createTaskSchema.safeParse(data);
    }

    getTasks(data: any) {
        return getTasksSchema.safeParse(data);
    }
}

export const TaskValidationInstance = new TaskValidation();
