import { Router } from "express";
import {
    createBrand,
    createUser,
    updateUser,
} from "../../controllers/user.controller";

const router = Router();

router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.post("/brand", createBrand);

export default router;
