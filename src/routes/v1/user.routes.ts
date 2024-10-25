import { Router } from "express";
import {
    getUsersByRole,
    listTeammates,
    searchUser,
} from "../../controllers/user.controller";

const router = Router();

// Get all users
router.get("/", getUsersByRole);

// List and view teammates
router.get("/team", listTeammates);

// Search and view any user
router.get("/search", searchUser);

export default router;
