import express from "express";
import { currentUser, requireAuth, windowRateLimiter } from "../middlewares";

import NotificationController from "../controllers/notification.controller";

const router = express.Router();

router.get(
  "/send",
  currentUser,
  requireAuth,
  windowRateLimiter,
  NotificationController.sendNotification
);

export { router as sendNotification };
