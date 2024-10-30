import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.get("/check", AuthController.check);
router.get("/logout", AuthController.logout);

export const AuthRouter = router;
