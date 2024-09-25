import { Router } from "express";
import { CurrencyController } from "../controllers/currency.controller";

const router = Router();

router.get("/", CurrencyController.getCurrencies);
router.get("/:id", CurrencyController.getCurrencyById);
router.post("/", CurrencyController.createCurrency);
router.put("/:id", CurrencyController.updateCurrency);

export const CurrencyRouter = router;
