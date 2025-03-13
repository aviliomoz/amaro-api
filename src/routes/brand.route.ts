import { Router } from "express";
import { BrandController } from "../controllers/brand.controller";

const router = Router()

router.get("/:id", BrandController.getBrandById)
router.get("/slug/:slug", BrandController.getBrandBySlug)
router.get("/user/:user_id", BrandController.getBrandsByUser)

export const BrandRouter = router;