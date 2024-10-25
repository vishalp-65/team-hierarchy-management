import { Router } from "express";
import {
    assignRoleToUser,
    createBrand,
    createUser,
    listUsersWithTOHierarchy,
    updateBrand,
    updateUser,
} from "../../controllers/admin.controller";

const router = Router();

router.post("/user", createUser);

router.put("/user/:id", updateUser);
router.post("/brand", createBrand);
router.put("/brand/:id", updateBrand);
router.post("/assign-role", assignRoleToUser);
router.get("/users/hierarchy/:userId", listUsersWithTOHierarchy);

export default router;
