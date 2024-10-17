// src/validations/task.validation.ts
import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    task_type: z.enum(["general", "brand", "event", "inventory"]),
    due_date: z
        .string({ required_error: "Due date is required" })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .refine((val) => new Date(val) > new Date(), {
            message: "Due date must be in the future",
        })
        .transform((val) => new Date(val)),
    assigneeId: z.string().min(1, "AssigneeId is required"),
    brandId: z.string().optional(),
    eventId: z.string().optional(),
    inventoryId: z.string().optional(),
});

export const editTaskSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    due_date: z
        .string()
        .optional()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .refine((val) => new Date(val) > new Date(), {
            message: "Due date must be in the future",
        })
        .transform((val) => new Date(val)),
    assigneeId: z.string().optional(),
});

export const getTasksSchema = z.object({
    taskType: z.enum(["all", "your", "team", "delegated"]).optional(),
    assignedBy: z.string().optional(),
    assignedTo: z.string().optional(),
    teamOwner: z.string().optional(),
    dueDatePassed: z
        .string()
        .optional()
        .transform((val) => (val === "1" ? true : false)), // Cast from "1" or "0" to boolean
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

    editTask(data: any) {
        return editTaskSchema.safeParse(data);
    }

    getTasks(data: any) {
        return getTasksSchema.safeParse(data);
    }
    updateTaskStatus(data: any) {
        return updateTaskStatusSchema.safeParse(data);
    }

    addComment(data: any) {
        return addCommentSchema.safeParse(data);
    }
}

export const TaskValidationInstance = new TaskValidation();
