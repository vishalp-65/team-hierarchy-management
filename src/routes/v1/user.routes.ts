import { Router } from "express";
import { listTeammates, searchUser } from "../../controllers/user.controller";

const router = Router();

// List and view teammates
router.get("/team", listTeammates);

// Search and view any user
router.get("/search", searchUser);

export default router;
