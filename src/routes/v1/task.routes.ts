// src/routes/task.routes.ts
import { Router } from "express";
import {
    addComment,
    createTask,
    deleteTask,
    editTask,
    getTasks,
    updateTaskStatus,
} from "../../controllers/task.controller";
import { checkTaskPermissions } from "../../middlewares/auth.middleware";

const router = Router();

// Create a new task
router.post("/", createTask);

// Get tasks with filters
router.get("/", getTasks);

// Edit task
router.patch("/:taskId", checkTaskPermissions, editTask);

// Update task status
router.patch("/:taskId/status", checkTaskPermissions, updateTaskStatus);

// Delete task
router.delete("/:taskId", checkTaskPermissions, deleteTask);

// Add comment to a task
router.post("/:taskId/comments", checkTaskPermissions, addComment);

export default router;
