"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regisValidation = void 0;
const express_validator_1 = require("express-validator");
exports.regisValidation = [
    (0, express_validator_1.body)("username").notEmpty(),
    (0, express_validator_1.body)("email").notEmpty().isEmail().withMessage("Email is required"),
    (0, express_validator_1.body)("password").notEmpty().isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        minUppercase: 0,
    }),
    (req, resp, next) => {
        const errorValidator = (0, express_validator_1.validationResult)(req);
        if (!errorValidator.isEmpty()) {
            return resp.status(400).send({ error: errorValidator });
        }
        next();
    },
];
