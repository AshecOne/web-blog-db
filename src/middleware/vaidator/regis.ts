import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const regisValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isAlpha()
    .withMessage("Username must contain only letters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 0,
    })
    .withMessage(
      "Password must be at least 6 characters long, min 1 letter and number"
    ),
  (req: Request, resp: Response, next: NextFunction) => {
    const errorValidator = validationResult(req);
    if (!errorValidator.isEmpty()) {
      return resp.status(400).send({ error: errorValidator });
    }
    next();
  },
];
