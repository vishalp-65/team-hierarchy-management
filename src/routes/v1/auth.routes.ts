import { Router } from "express";
import { changePassword, login } from "../../controllers/auth.controller";

const router = Router();

// Login route
router.post("/login", login);

// Change password route
router.post("/changePassword", changePassword);

export default router;
