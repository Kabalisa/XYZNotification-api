import express from "express";

import NotificationController from "../controllers/notification.controller";

const router = express.Router();

router.get("/:id", NotificationController.sendNotification);

export { router as fetchProductRouter };
