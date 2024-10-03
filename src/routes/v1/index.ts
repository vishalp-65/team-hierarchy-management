import { Router } from "express";
import httpStatus from "http-status";
import adminRoutes from "./adminRoutes";
import { authorizeRoles, checkAdmin } from "../../middlewares/auth.middleware";
import brandRoutes from "./brandRoutes";

const router = Router();

// Node routes
router.use("/admin", checkAdmin, adminRoutes);
router.use("/brand", authorizeRoles(["BO"]), brandRoutes);

// Checking api is live
router.get("/info", (req, res) => {
    res.status(httpStatus.OK).json("Api is working fine");
});

export default router;
