// src/routes/brandRoutes.ts
import { Router } from "express";
import {
    createBrand,
    getBrandDetails,
    getBrands,
    updateBrand,
} from "../../controllers/brand.controller";
import { authorizeRoles } from "../../middlewares/auth.middleware";
import {
    createContact,
    updateContact,
} from "../../controllers/contact.controller";

const router = Router();

// Allow only BO to manage brands
router.post("/create", authorizeRoles(["BO", "ADMIN", "MG"]), createBrand);

// Get all brands related to current User
router.get("/", authorizeRoles(["BO", "ADMIN", "MG"]), getBrands);

// Update existing brand
router.put("/:brandId", authorizeRoles(["BO", "ADMIN", "MG"]), updateBrand);

router.get("/:brandId", getBrandDetails);

// Create contact for a brand
router.post(
    "/contact/:brandId",
    authorizeRoles(["BO", "ADMIN", "MG"]),
    createContact
);

// Update contact for a brand
router.put(
    "/contact/:brandId",
    authorizeRoles(["BO", "ADMIN", "MG"]),
    updateContact
);

export default router;
