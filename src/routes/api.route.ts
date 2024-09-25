import { Router } from "express";
import { AuthRouter } from "./auth.route";
import { UserRouter } from "./user.route";
import { validateToken } from "../middlewares/auth.middleware";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", validateToken, UserRouter);

export const ApiRouter = router;
