import { Router } from "express";
import { CurrencyController } from "../controllers/currency.controller";

const router = Router();

router.get("/", CurrencyController.getCurrencies);
router.get("/:code", CurrencyController.getCurrencyByCode);
router.post("/", CurrencyController.createCurrency);
router.put("/", CurrencyController.updateCurrency);

export const CurrencyRouter = router;
