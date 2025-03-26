import { Router } from "express";
import { ItemController } from "../controllers/item.controller";

const router = Router()

router.get("/", ItemController.getItems)
router.get("/ingredients", ItemController.searchIngredients)
router.get("/:id", ItemController.getItemById)
router.post("/", ItemController.createItem)
router.put("/:id", ItemController.updateItem)

export const ItemRouter = router;