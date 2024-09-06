import { Router } from "express";
import {
  validateId,
  validateToken,
} from "../middlewares/validation.middlewares";
import { getUser } from "../controllers/user.controllers";

const router = Router();

router.get("/:id", validateToken, validateId, getUser);

export default router;
