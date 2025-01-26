import { Router } from "express";
import { RestaurantController } from "../controllers/restaurant.controller";

const router = Router()

router.get("/", RestaurantController.getRestaurantsByUser)
router.get("/current", RestaurantController.getCurrentRestaurant)
router.get("/:id", RestaurantController.getRestaurantById)
router.post("/current/:id", RestaurantController.setCurrentRestaurantId)

export const RestaurantRouter = router