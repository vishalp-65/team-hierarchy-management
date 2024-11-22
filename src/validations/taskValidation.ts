import { z } from "zod";

// Reusable date validation schema
const futureDate = z
    .string({ required_error: "Due date is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    })
    .refine((val) => new Date(val) > new Date(), {
        message: "Due date must be in the future",
    })
    .transform((val) => new Date(val));

// Reusable transformation function for converting string to array
const stringToArray = (val: any) => {
    if (Array.isArray(val)) {
        return val; // If it's already an array, return as is
    }
    if (typeof val === "string" && val !== "") {
        // If the value is a string, split it by commas
        return val.split(",").map((item) => item.trim()); // .trim() to clean any extra spaces
    }
    return []; // If it's neither, return an empty array
};

// Enum for task types
const taskTypeEnum = z.enum(["general", "brand", "event", "inventory"]);

// Task validation schemas
export const createTaskSchema = z
    .object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        task_type: taskTypeEnum,
        due_date: futureDate, // Reuse the futureDate validation
        assigneeId: z.string().min(1, "AssigneeId is required"),
        brandId: z.string().optional(),
        eventId: z.string().optional(),
        inventoryId: z.string().optional(),
        // Ensure only one of brandId, eventId, or inventoryId is provided
    })
    .refine(
        (data) =>
            [data.brandId, data.eventId, data.inventoryId].filter(Boolean)
                .length <= 1,
        {
            message: "Only one of brandId, eventId, or inventoryId is allowed.",
            path: ["taskType"], // Point to a relevant path in error
        }
    );

// Edit task schema
export const editTaskSchema = z
    .object({
        title: z.string().optional(),
        description: z.string().optional(),
        due_date: futureDate.optional(),
        assigneeId: z.string().optional(),
    })
    .refine(
        (data) =>
            [data.description, data.due_date, data.title, data.assigneeId].some(
                Boolean
            ),
        {
            message: "At least one field must be provided",
            path: [],
        }
    );

// Get tasks schema
export const getTasksSchema = z.object({
    taskType: z.enum(["all", "your", "team", "delegated"]).optional(),
    // Use the reusable stringToArray function for these fields
    assignedBy: z.string().optional().transform(stringToArray),
    assignedTo: z.string().optional().transform(stringToArray),
    teamOwner: z.string().optional().transform(stringToArray),
    taskBased: z
        .enum(["all", "general", "brand", "event", "inventory"])
        .optional(),
    dueDatePassed: z
        .string()
        .optional()
        .transform((val) => (val === "1" ? true : false)), // Cast "1" or "0" to boolean
    brandName: z.string().optional(),
    inventoryName: z.string().optional(),
    eventName: z.string().optional(),
    sortBy: z
        .enum(["title", "due_date", "status", "created_at"])
        .optional()
        .default("created_at"),
    status: z
        .enum(["open", "in-progress", "completed", "overdue"])
        .optional()
        .transform((val) => val?.toLowerCase()),
    taskName: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
    page: z
        .string()
        .or(z.number())
        .optional()
        .default("1")
        .transform((val) => Number(val))
        .refine((n) => n > 0, {
            message: "Page must be greater than 0",
        }),
    limit: z
        .string()
        .or(z.number())
        .optional()
        .default("10")
        .transform((val) => Number(val))
        .refine((n) => n > 0, {
            message: "Limit must be greater than 0",
        }),
});

// Update task status schema
export const updateTaskStatusSchema = z.object({
    status: z.enum(["open", "in-progress", "completed", "overdue"]),
});

// Add comment schema
export const addCommentSchema = z.object({
    content: z.string().min(1, "Comment content is required"),
});

// get comment schema
export const commentPaginationSchema = z.object({
    taskId: z.string().min(1, "taskId is required"),
    page: z
        .string()
        .or(z.number())
        .optional()
        .default("1")
        .transform((val) => Number(val))
        .refine((n) => n > 0, {
            message: "Page must be greater than 0",
        }),
    limit: z
        .string()
        .or(z.number())
        .optional()
        .default("10")
        .transform((val) => Number(val))
        .refine((n) => n > 0, {
            message: "Limit must be greater than 0",
        }),
});

// Validation class
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
    getComment(data: any) {
        return commentPaginationSchema.safeParse(data);
    }
}

export const TaskValidationInstance = new TaskValidation();
