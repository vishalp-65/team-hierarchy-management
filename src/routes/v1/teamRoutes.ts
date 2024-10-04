// src/routes/teamRoutes.ts
import { Router } from "express";
import { getTeamHierarchy } from "../../controllers/team.controller";

const router = Router();

// Allow only TO to view their team
router.get("/", getTeamHierarchy);

export default router;
