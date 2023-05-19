import express from "express";
import { body, header } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../middlewares";

import NotificationController from "../controllers/notification.controller";

const router = express.Router();

router.post(
  "/buy",
  [
    body("amount")
      .trim()
      .isNumeric()
      .withMessage("enter a valid amount of requests in number"),
    header("token")
      .notEmpty()
      .withMessage("the token is required"),
  ],
  validateRequest,
  currentUser,
  requireAuth,
  NotificationController.buyRequests
);

export { router as buyRequests };
