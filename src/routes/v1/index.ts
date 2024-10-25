import { Router } from "express";
import adminRoutes from "./admin.routes";
import { authorizeRoles } from "../../middlewares/auth.middleware";
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
router.use("/admin", authorizeRoles(["ADMIN"]), adminRoutes);

// Brand routes
router.use("/brand", brandRoutes);

// Team routes
router.use("/team", authorizeRoles(["TO"]), teamRoutes);

// User routes
router.use("/user", userRoutes);

// Task routes
router.use("/tasks", tasksRoutes);

// Analytics routes
router.use("/analytics", authorizeRoles(["ADMIN", "MG"]), analyticsRoutes);

// Notification routes
router.use("/notification", notificationRoutes);

// Inventory routes
router.use("/inventory", inventoryRoutes);

// Event routes
router.use("/event", eventsRoutes);

// filter routes
router.use("/filter", filterRoutes);

// Auth routes
router.use("/auth", authRoutes);

export default router;
