import { Router } from "express";
import {
    assignRoleToUser,
    createBrand,
    createUser,
    updateBrand,
    updateUser,
} from "../../controllers/user.controller";

const router = Router();

router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.post("/brand", createBrand);
router.put("/brand/:id", updateBrand);
router.post("/assign-role", assignRoleToUser);

export default router;
