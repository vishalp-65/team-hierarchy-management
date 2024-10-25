// src/routes/analytics.routes.ts
import { Router } from "express";
import { getTaskAnalytics } from "../../controllers/analytics.controller";

const router = Router();

// Get task analytics
router.get("/", getTaskAnalytics);

export default router;
