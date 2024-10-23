// src/routes/task.routes.ts
import { Request, Router } from "express";
import {
    addComment,
    createTask,
    deleteTask,
    editTask,
    getComments,
    getTaskHistory,
    getTasks,
    updateTaskStatus,
} from "../../controllers/task.controller";
import { checkTaskPermissions } from "../../middlewares/auth.middleware";
import multer from "multer";
import { allowedFileTypes, storage } from "../../utils/fileUpload";

// File filter to validate file type
const fileFilter = (req: Request, file: any, cb: any) => {
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type"), false); // Reject unsupported file types
    }
};

// Multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, // Set file size limit to 5MB
    },
});

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
router.post(
    "/:taskId/comments",
    upload.array("file"),
    checkTaskPermissions,
    addComment
);

// Route to get Task History
router.get("/:taskId/history", checkTaskPermissions, getTaskHistory);

// Get comment route
router.get("/comment", checkTaskPermissions, getComments);

export default router;
