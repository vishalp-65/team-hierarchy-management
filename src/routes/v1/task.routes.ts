// src/routes/task.routes.ts
import { Router } from "express";
import { createTask } from "../../controllers/task.controller";

const router = Router();

// Create a new task
router.post("/", createTask);

export default router;
