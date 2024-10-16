import { Router } from "express";
import httpStatus from "http-status";
import adminRoutes from "./admin.routes";
import { authorizeRoles, checkAdmin } from "../../middlewares/auth.middleware";
import brandRoutes from "./brand.routes";
import teamRoutes from "./team.routes";
import userRoutes from "./user.routes";
import tasksRoutes from "./task.routes";
import analyticsRoutes from "./analytics.routes";
import notificationRoutes from "./notification.routes";

const router = Router();

// admin routes
router.use("/admin", checkAdmin, adminRoutes);

// Brand routes
router.use("/brand", brandRoutes);

// Team routes
router.use("/team", authorizeRoles(["TO"]), teamRoutes);

// User routes
router.use("/user", userRoutes);

// Task routes
router.use(
    "/tasks",
    authorizeRoles(["ADMIN", "MG", "TO", "PO", "BO"]),
    tasksRoutes
);

// Analytics routes
router.use("/analytics", authorizeRoles(["ADMIN", "MG"]), analyticsRoutes);

// Notification routes
router.use("/notification", notificationRoutes);

export default router;
