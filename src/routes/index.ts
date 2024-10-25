import { Router } from "express";

import orgRoutes from "./v1/index";
import { authentication } from "../middlewares/auth.middleware";
import httpStatus from "http-status";

const router = Router();

router.use("/v1", authentication, orgRoutes);

// Checking api is live
router.get("/info", (req, res) => {
    res.status(httpStatus.OK).json("Api is working fine");
});

export default router;
