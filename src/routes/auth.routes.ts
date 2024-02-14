import { Router } from "express";
import { login, refresh, signup } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);

export default router;
