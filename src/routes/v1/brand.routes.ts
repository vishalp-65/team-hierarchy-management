// src/routes/brandRoutes.ts
import { Router } from "express";
import {
    createBrand,
    getBrandDetails,
    getBrands,
} from "../../controllers/brand.controller";
import { authorizeRoles } from "../../middlewares/auth.middleware";
import {
    createContact,
    updateContact,
} from "../../controllers/contact.controller";

const router = Router();

// Allow only BO to manage brands
router.post("/create", authorizeRoles(["BO"]), createBrand);

// Get all brands related to current User
router.get("/", authorizeRoles(["BO"]), getBrands);

router.get("/:brandId", authorizeRoles(["BO", "TO", "PO"]), getBrandDetails);

// Create contact for a brand
router.post("/contact/:brandId", authorizeRoles(["BO"]), createContact);

// Update contact for a brand
router.put("/contact/:brandId", authorizeRoles(["BO"]), updateContact);

export default router;
