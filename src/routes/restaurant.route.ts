import { Router } from "express";
import { RestaurantController } from "../controllers/restaurant.controller";

const router = Router()

router.get("/", RestaurantController.getRestaurantsByUser)
router.get("/:id", RestaurantController.getRestaurantById)
router.get("/slug/:slug", RestaurantController.getRestaurantBySlug)

export const RestaurantRouter = router;