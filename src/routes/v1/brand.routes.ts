// src/routes/brandRoutes.ts
import { Router } from "express";
import {
    createOrUpdateBrand,
    getBrands,
} from "../../controllers/brand.controller";

const router = Router();

// Allow only BO to manage brands
router.post("/create", createOrUpdateBrand);
router.get("/", getBrands);

export default router;
