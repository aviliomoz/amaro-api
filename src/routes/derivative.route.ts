import { Router } from "express";
import { DerivativeController } from "../controllers/derivative.controller";

const router = Router()

router.get("/:item_id", DerivativeController.getItemDerivatives)
router.put("/:item_id", DerivativeController.updateDerivatives)

export const DerivativeRouter = router;