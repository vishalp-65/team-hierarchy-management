// src/controllers/task.controller.ts
import { Response } from "express";
import { TaskServiceInstance } from "../services/task.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { TaskValidationInstance } from "../validations/taskValidation";
import { IGetUserAuthInfoRequest } from "../middlewares/auth.middleware";
import { handleValidationErrors } from "../utils/errorHandler";
import sendResponse from "../utils/responseHandler";

// Create a new task
export const createTask = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const validatedData = handleValidationErrors(
            TaskValidationInstance.createTask(req.body)
        );
        const task = await TaskServiceInstance.createTask(
            validatedData.data,
            req.user
        );
        sendResponse(res, httpStatus.CREATED, true, "Task created", task);
    }
);

// Get tasks with filters
export const getTasks = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const filters = handleValidationErrors(
            TaskValidationInstance.getTasks(req.query)
        );
        const tasks = await TaskServiceInstance.getTasks(
            req.user,
            filters.data
        );
        sendResponse(res, httpStatus.OK, true, "All tasks", tasks);
    }
);

// Update task status
export const updateTaskStatus = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { taskId } = req.params;
        const validatedData = handleValidationErrors(
            TaskValidationInstance.updateTaskStatus(req.body)
        );

        const updatedTask = await TaskServiceInstance.updateTaskStatus(
            taskId,
            validatedData.data?.status,
            req.user
        );
        sendResponse(
            res,
            httpStatus.OK,
            true,
            "Task status updated",
            updatedTask
        );
    }
);

// Edit task
export const editTask = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { taskId } = req.params;
        const validatedData = handleValidationErrors(
            TaskValidationInstance.editTask(req.body)
        );
        const updatedTask = await TaskServiceInstance.editTask(
            taskId,
            validatedData.data,
            req.user
        );
        sendResponse(res, httpStatus.OK, true, "Task updated", updatedTask);
    }
);

// Delete task
export const deleteTask = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { taskId } = req.params;
        await TaskServiceInstance.deleteTask(taskId, req.user);
        sendResponse(res, httpStatus.NO_CONTENT, true, "Task deleted");
    }
);

// Add comment to a task
export const addComment = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { taskId } = req.params;
        const validatedData = handleValidationErrors(
            TaskValidationInstance.addComment(req.body)
        );

        const comment = await TaskServiceInstance.addComment(
            taskId,
            validatedData.data?.content,
            req.user,
            req.file
        );
        sendResponse(
            res,
            httpStatus.CREATED,
            true,
            "Comment added to task",
            comment
        );
    }
);

// Get task history
export const getTaskHistory = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { taskId } = req.params;
        const history = await TaskServiceInstance.getTaskHistory(
            taskId,
            req.user
        );
        sendResponse(res, httpStatus.OK, true, "Task history", history);
    }
);
