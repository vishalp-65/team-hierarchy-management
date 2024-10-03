import { Router } from "express";
import httpStatus from "http-status";
import adminRoutes from "./adminRoutes";
import { authentication, checkAdmin } from "../../middlewares/auth.middleware";
// import brandRoutes from "./brandRoutes";

const router = Router();

// Node routes
router.use("/admin", authentication, checkAdmin, adminRoutes);
// router.use("/brand", brandRoutes);

// Checking api is live
router.get("/info", (req, res) => {
    res.status(httpStatus.OK).json("Api is working fine");
});

export default router;
