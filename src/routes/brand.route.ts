import { Router } from "express";
import { BrandController } from "../controllers/brand.controller";

const router = Router()

router.get("/:id", BrandController.getBrandById)

export const BrandRouter = router