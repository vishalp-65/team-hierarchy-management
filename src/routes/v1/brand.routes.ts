// src/routes/brandRoutes.ts
import { Router } from "express";
import {
    createOrUpdateBrand,
    getBrandDetails,
    getBrands,
} from "../../controllers/brand.controller";
import { authorizeRoles } from "../../middlewares/auth.middleware";

const router = Router();

// Allow only BO to manage brands
router.post("/create", authorizeRoles(["BO"]), createOrUpdateBrand);

// Get all brands realted to current User
router.get("/", authorizeRoles(["BO"]), getBrands);

router.get("/:brandId", authorizeRoles(["BO", "TO", "PO"]), getBrandDetails);

export default router;
