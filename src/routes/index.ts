import { Router } from "express";

import orgRoutes from "./v1/index";
import httpStatus from "http-status";

const router = Router();

router.use("/v1", orgRoutes);

// Checking api is live
router.get("/info", (req, res) => {
    res.status(httpStatus.OK).json("Api is working fine");
});

export default router;
