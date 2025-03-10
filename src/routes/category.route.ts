import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

const router = Router()

router.get("/:brand_id/:type", CategoryController.getCategoriesByType)

export const CategoryRouter = router;