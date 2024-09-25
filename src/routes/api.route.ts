import { Router } from "express";
import { AuthRouter } from "./auth.route";
import { UserRouter } from "./user.route";
import { validateToken } from "../middlewares/auth.middleware";
import { CurrencyRouter } from "./currency.route";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", validateToken, UserRouter);
router.use("/currencies", validateToken, CurrencyRouter);

export const ApiRouter = router;
