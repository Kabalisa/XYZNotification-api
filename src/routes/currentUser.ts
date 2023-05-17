import express from "express";
import { header } from "express-validator";

import AuthController from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validate-request";
import { currentUser } from "../middlewares/current-user";

const router = express.Router();

router.get(
  "/currentuser",
  [header("token").notEmpty().withMessage("the token is required")],
  validateRequest,
  currentUser,
  AuthController.currentUser
);

export { router as currentUserRouter };
