// src/controllers/task.controller.ts
import { Response } from "express";
import { TaskServiceInstance } from "../services/task.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { TaskValidationInstance } from "../validations/taskValidation";
import { IGetUserAuthInfoRequest } from "../middlewares/auth.middleware";

// Create a new task
export const createTask = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const validatedData = TaskValidationInstance.createTask(req.body);
        const task = await TaskServiceInstance.createTask(
            validatedData.data,
            req.user
        );
        res.status(httpStatus.CREATED).json({ success: true, task });
    }
);

// Get tasks with filters
export const getTasks = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const filters = TaskValidationInstance.getTasks(req.query);
        const tasks = await TaskServiceInstance.getTasks(
            req.user,
            filters.data
        );
        res.status(httpStatus.OK).json({ success: true, tasks });
    }
);

// Update task status
export const updateTaskStatus = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { taskId } = req.params;
        const validatedData = TaskValidationInstance.updateTaskStatus(req.body);
        const updatedTask = await TaskServiceInstance.updateTaskStatus(
            taskId,
            validatedData.data?.status,
            req.user
        );
        res.status(httpStatus.OK).json({ success: true, task: updatedTask });
    }
);

// Edit task
export const editTask = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { taskId } = req.params;
        const validatedData = TaskValidationInstance.editTask(req.body);

        if (
            !validatedData?.data?.description &&
            !validatedData?.data?.due_date &&
            !validatedData?.data?.title
        ) {
            res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "Fields are empty",
            });
        }
        const updatedTask = await TaskServiceInstance.editTask(
            taskId,
            validatedData.data,
            req.user
        );
        res.status(httpStatus.OK).json({ success: true, task: updatedTask });
    }
);

// Delete task
export const deleteTask = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { taskId } = req.params;
        await TaskServiceInstance.deleteTask(taskId, req.user);
        res.status(httpStatus.NO_CONTENT).json({ success: true });
    }
);

// Add comment to a task
export const addComment = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { taskId } = req.params;
        const validatedData = TaskValidationInstance.addComment(req.body);
        const comment = await TaskServiceInstance.addComment(
            taskId,
            validatedData.data?.content,
            req.user
        );
        res.status(httpStatus.CREATED).json({ success: true, comment });
    }
);

// Get task history
export const getTaskHistory = catchAsync(
    async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { taskId } = req.params;
        const history = await TaskServiceInstance.getTaskHistory(taskId);
        res.status(httpStatus.OK).json({ success: true, history });
    }
);
