import { Router } from "express";
import {
    changePassword,
    getUser,
    login,
} from "../../controllers/auth.controller";
import { authentication } from "../../middlewares/auth.middleware";

const router = Router();

// Login route
router.post("/login", login);

// Get user by token
router.get("/", authentication, getUser);

// Change password route
router.post("/changePassword", changePassword);

export default router;
