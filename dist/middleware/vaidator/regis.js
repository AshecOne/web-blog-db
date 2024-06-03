"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regisValidation = void 0;
const express_validator_1 = require("express-validator");
exports.regisValidation = [
    (0, express_validator_1.body)("username")
        .notEmpty()
        .withMessage("Username is required")
        .isAlpha()
        .withMessage("Username must contain only letters"),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        minUppercase: 0,
    })
        .withMessage("Password must be at least 6 characters long, min 1 letter and number"),
    (req, resp, next) => {
        const errorValidator = (0, express_validator_1.validationResult)(req);
        if (!errorValidator.isEmpty()) {
            return resp.status(400).send({ error: errorValidator });
        }
        next();
    },
];
