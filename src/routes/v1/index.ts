import { Router } from "express";
import httpStatus from "http-status";
import userRoutes from "./userRoutes";
// import brandRoutes from "./brandRoutes";

const router = Router();

// Node routes
router.use("/admin", userRoutes);
// router.use("/brand", brandRoutes);

// Checking api is live
router.get("/info", (req, res) => {
    res.status(httpStatus.OK).json("Api is working fine");
});

export default router;
