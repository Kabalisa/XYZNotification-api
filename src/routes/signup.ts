import express from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

router.post(
  "/signup",
  [
    body("name")
      .isLength({ min: 1, max: 40 })
      .withMessage("name between 1 and 40 characters"),
    body("phoneNumber")
      .trim()
      .matches(/^[+]*[0-9]{10,12}$/)
      .withMessage("enter a valid Rwandan Number"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("enter a valid email"),
    body("password")
      .trim()
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/)
      .withMessage(
        "password: 8 - 20 characters, uppercase and lowercase characters and numbers"
      ),
  ],
  validateRequest,
  AuthController.signup
);

export { router as signupRouter };
