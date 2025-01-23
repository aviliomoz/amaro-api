import { Router } from "express";
import { AuthRouter } from "./auth.route";
import { UserRouter } from "./user.route";
import { validateToken } from "../middlewares/auth.middleware";
import { CurrencyRouter } from "./currency.route";
import { BranchRouter } from "./branch.route";
import { BrandRouter } from "./brand.route";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", validateToken, UserRouter);
router.use("/currencies", CurrencyRouter);
router.use("/branches", BranchRouter);
router.use("/brands", BrandRouter);

export const ApiRouter = router;
