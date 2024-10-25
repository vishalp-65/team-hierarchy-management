// src/routes/analytics.routes.ts
import { Router } from "express";
import { getUsersByRole } from "../../controllers/user.controller";
import { getBrands } from "../../controllers/brand.controller";
import { getTeamOwnersByRole } from "../../controllers/team.controller";

const router = Router();

// Get all users
router.get("/users", getUsersByRole);

// Get brand based on user roles
router.get("/brands", getBrands);

// get team owners
router.get("/team", getTeamOwnersByRole);

export default router;
