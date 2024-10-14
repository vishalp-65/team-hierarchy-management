// src/routes/task.routes.ts
import { Router } from "express";
import { createTask, getTasks } from "../../controllers/task.controller";

const router = Router();

// Create a new task
router.post("/", createTask);

// Get tasks with filters
router.get("/", getTasks);

export default router;
