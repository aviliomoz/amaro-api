import { Router } from "express";
import { ItemController } from "../controllers/item.controller";

const router = Router()

router.get("/:branch_id", ItemController.getItemsByType)

export const ItemRouter = router;