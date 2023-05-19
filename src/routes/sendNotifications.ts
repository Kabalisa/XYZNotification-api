import express from "express";
import { header } from "express-validator";
import {
  currentUser,
  requireAuth,
  windowRateLimiter,
  monthlyRateLimiter,
  globalRateLimiter,
  validateRequest,
} from "../middlewares";

import NotificationController from "../controllers/notification.controller";

const router = express.Router();

router.get(
  "/send",
  [
    header("token")
      .notEmpty()
      .withMessage("the token is required"),
  ],
  validateRequest,
  currentUser,
  requireAuth,
  globalRateLimiter,
  monthlyRateLimiter,
  windowRateLimiter,
  NotificationController.sendNotification
);

export { router as sendNotification };
