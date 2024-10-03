import { Router } from "express";
import {
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

export default router;
