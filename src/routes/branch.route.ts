import { Router } from "express";
import { BranchController } from "../controllers/branch.controller";

const router = Router()

router.get("/:id", BranchController.getBranchById)
router.get("/brand/:brand_id", BranchController.getBranchesByBrand)
router.get("/brand/:brand_id/slug/:slug", BranchController.getBranchBySlug)

export const BranchRouter = router;