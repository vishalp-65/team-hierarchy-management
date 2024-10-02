import { Router } from "express";
import { createUser, updateUser } from "../../controllers/user.controller";

const router = Router();

router.post("/user", createUser);
router.put("/user/:id", updateUser);

export default router;
