// routes/inventory.routes.ts
import { Router } from "express";
import {
    createEvent,
    deleteEvent,
    getEventById,
    getEvents,
    updateEvent,
} from "../../controllers/inventoryAndEvent.controller";
import { authorizeRoles } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", createEvent);

router.put("/:id", updateEvent);

router.delete("/:id", authorizeRoles(["ADMIN"]), deleteEvent);

router.get("/:id", getEventById);
router.get("/", getEvents);

export default router;
