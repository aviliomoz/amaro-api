import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

const router = Router()

router.get("/", CategoryController.getCategories)
router.post("/", CategoryController.createCategory)
router.put("/:id", CategoryController.updateCategory)

export const CategoryRouter = router;