// src/routes/task.routes.ts
import { Router } from "express";
import {
    addComment,
    createTask,
    deleteTask,
    editTask,
    getTaskHistory,
    getTasks,
    updateTaskStatus,
} from "../../controllers/task.controller";
import { checkTaskPermissions } from "../../middlewares/auth.middleware";
import multer from "multer";

const router = Router();

// Multer configuration for file upload
const upload = multer({ dest: "uploads/" });

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
router.post(
    "/:taskId/comments",
    upload.single("file"),
    checkTaskPermissions,
    addComment
);

// Route to get Task History
router.get("/:taskId/history", checkTaskPermissions, getTaskHistory);

export default router;
