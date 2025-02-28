import { Router } from "express";
import { BranchController } from "../controllers/branch.controller";

const router = Router()

router.get("/:id", BranchController.getBranchById)
router.get("/brand/:brand_id", BranchController.getBranchesByBrand)

export const BranchRouter = router;