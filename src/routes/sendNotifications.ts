import express from "express";
import {
  currentUser,
  requireAuth,
  windowRateLimiter,
  monthlyRateLimiter,
  globalRateLimiter,
} from "../middlewares";

import NotificationController from "../controllers/notification.controller";

const router = express.Router();

router.get(
  "/send",
  currentUser,
  requireAuth,
  globalRateLimiter,
  monthlyRateLimiter,
  windowRateLimiter,
  NotificationController.sendNotification
);

export { router as sendNotification };
