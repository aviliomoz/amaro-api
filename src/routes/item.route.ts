import { Router } from "express";
import { ItemController } from "../controllers/item.controller";

const router = Router()

router.get("/", ItemController.getItems)
router.get("/search", ItemController.searchItems)
router.get("/:id", ItemController.getItemById)
router.post("/", ItemController.createItem)
router.put("/:id", ItemController.updateItem)

export const ItemRouter = router;