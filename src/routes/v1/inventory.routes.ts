// routes/inventory.routes.ts
import { Router } from "express";
import {
    createInventory,
    deleteInventory,
    getInventories,
    getInventoryById,
    updateInventory,
} from "../../controllers/inventoryAndEvent.controller";
import { authorizeRoles } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", createInventory);

router.put("/:id", updateInventory);

router.delete("/:id", authorizeRoles(["ADMIN"]), deleteInventory);

router.get("/:id", getInventoryById);
router.get("/", getInventories);

export default router;
