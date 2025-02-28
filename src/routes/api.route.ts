import { Router } from "express";
import { AuthRouter } from "./auth.route";
import { UserRouter } from "./user.route";
import { validateToken } from "../middlewares/auth.middleware";
import { BrandRouter } from "./brand.route";
import { BranchRouter } from "./branch.route";
import { CategoryRouter } from "./category.route";
import { ItemRouter } from "./item.route";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", validateToken, UserRouter);
router.use("/brands", BrandRouter);
router.use("/branches", BranchRouter);
router.use("/categories", CategoryRouter);
router.use("/items", ItemRouter);

export const ApiRouter = router;
