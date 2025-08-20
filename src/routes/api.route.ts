import { Router } from "express";
import { validateToken } from "../middlewares/auth.middleware";

import { AuthRouter } from "./auth.route";
import { UserRouter } from "./user.route";
import { RestaurantRouter } from "./restaurant.route";
import { CategoryRouter } from "./category.route";
import { ItemRouter } from "./item.route";
import { IngredientRouter } from "./ingredient.route";
import { DerivativeRouter } from "./derivative.route";
import { DeviceRouter } from "./device.route";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", validateToken, UserRouter);
router.use("/restaurants", RestaurantRouter);
router.use("/categories", CategoryRouter);
router.use("/items", ItemRouter);
router.use("/ingredients", IngredientRouter);
router.use("/derivatives", DerivativeRouter);
router.use("/devices", DeviceRouter);

export const ApiRouter = router;
