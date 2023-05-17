import express from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

router.post(
  "/signin",
  [
    body("phoneNumber")
      .trim()
      .matches(/^[+]*[0-9]{10,12}$/)
      .withMessage("enter a valid Rwandan Number"),
    body("password")
      .trim()
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/)
      .withMessage(
        "password: 8 - 20 characters, uppercase and lowercase characters and numbers"
      ),
  ],
  validateRequest,
  AuthController.signin
);

export { router as signinRouter };
