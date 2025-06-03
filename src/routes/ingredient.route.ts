import { Router } from "express";
import { IngredientController } from "../controllers/ingredient.controller";

const router = Router()

router.get("/search", IngredientController.searchIngredients)
router.post("/convert", IngredientController.getConsumedIngredients)
router.get("/:item_id", IngredientController.getItemRecipe)
router.get("/uses/:ingredient_id", IngredientController.getIngredientUses)
router.put("/:item_id", IngredientController.updateRecipe)

export const IngredientRouter = router;