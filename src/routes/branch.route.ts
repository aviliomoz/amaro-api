import { Router } from "express";
import { BranchController } from "../controllers/branch.controller";

const router = Router()

router.get("/", BranchController.getBranchesByUser)
router.get("/current", BranchController.getCurrentBranch)
router.get("/:id", BranchController.getBranchById)
router.post("/current/:id", BranchController.setCurrentBranchId)

export const BranchRouter = router