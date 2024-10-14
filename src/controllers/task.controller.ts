// src/controllers/task.controller.ts
import { Request, Response } from "express";
import { TaskServiceInstance } from "../services/task.service";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import { TaskValidationInstance } from "../validations/taskValidation";
import { IGetUserAuthInfoRequest } from "../middlewares/auth.middleware";
import { TaskTypes } from "../types/types";

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
