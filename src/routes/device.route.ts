import { Router } from "express";
import { DeviceController } from "../controllers/device.controller";

const router = Router();

router.get("/check-device/:device_code", DeviceController.getVinculatedRestaurants);

export const DeviceRouter = router;