import { Router } from "express";

import orgRoutes from "./v1/index";
import { authentication } from "../middlewares/auth.middleware";

const router = Router();

router.use("/v1", authentication, orgRoutes);

export default router;
