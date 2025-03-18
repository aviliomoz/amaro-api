import { Router } from "express";
import { ItemController } from "../controllers/item.controller";

const router = Router()

router.get("/:id", ItemController.getItemById)
router.get("/equivalence/:id", ItemController.getItemEquivalence)
router.get("/branch/:branch_id", ItemController.getItemsByType)
router.post("/branch/:branch_id", ItemController.createItem)
router.put("/branch/:branch_id/:id", ItemController.updateItem)

export const ItemRouter = router;