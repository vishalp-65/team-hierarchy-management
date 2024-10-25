import { Router } from "express";
import adminRoutes from "./admin.routes";
import {
    authentication,
    authorizeRoles,
} from "../../middlewares/auth.middleware";
import brandRoutes from "./brand.routes";
import teamRoutes from "./team.routes";
import userRoutes from "./user.routes";
import tasksRoutes from "./task.routes";
import analyticsRoutes from "./analytics.routes";
import notificationRoutes from "./notification.routes";
import eventsRoutes from "./event.routes";
import inventoryRoutes from "./inventory.routes";
import filterRoutes from "./filter.routes";
import authRoutes from "./auth.routes";

const router = Router();

// admin routes
router.use("/admin", authentication, authorizeRoles(["ADMIN"]), adminRoutes);

// Brand routes
router.use("/brand", authentication, brandRoutes);

// Team routes
router.use("/team", authentication, authorizeRoles(["TO"]), teamRoutes);

// User routes
router.use("/user", authentication, userRoutes);

// Task routes
router.use("/tasks", authentication, tasksRoutes);

// Analytics routes
router.use(
    "/analytics",
    authentication,
    authorizeRoles(["ADMIN", "MG"]),
    analyticsRoutes
);

// Notification routes
router.use("/notification", authentication, notificationRoutes);

// Inventory routes
router.use("/inventory", authentication, inventoryRoutes);

// Event routes
router.use("/event", authentication, eventsRoutes);

// filter routes
router.use("/filter", authentication, filterRoutes);

// Auth routes
router.use("/auth", authRoutes);

export default router;
