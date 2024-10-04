import { Router } from "express";
import httpStatus from "http-status";
import adminRoutes from "./admin.routes";
import {
    authentication,
    authorizeRoles,
    checkAdmin,
} from "../../middlewares/auth.middleware";
import brandRoutes from "./brand.routes";
import teamRoutes from "./team.routes";
import userRoutes from "./user.routes";

const router = Router();

// admin routes
router.use("/admin", checkAdmin, adminRoutes);

// Brand routes
router.use("/brand", authorizeRoles(["BO"]), brandRoutes);

// Team routes
router.use("/team", authorizeRoles(["TO"]), teamRoutes);

// User routes
router.use("/user", authentication, userRoutes);

// Checking api is live
router.get("/info", (req, res) => {
    res.status(httpStatus.OK).json("Api is working fine");
});

export default router;
