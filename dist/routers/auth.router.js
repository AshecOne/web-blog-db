"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const regis_1 = require("../middleware/vaidator/regis");
const forgotPassword_1 = require("../middleware/vaidator/forgotPassword");
class AuthRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.authController = new auth_controller_1.AuthController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/regis", regis_1.regisValidation, this.authController.registerUser);
        this.route.post("/verify-email/:token", verifyToken_1.verifyToken, this.authController.verifyEmail);
        this.route.post("/forgot-password/", this.authController.forgotPassword);
        this.route.post("/verify-password/:token", verifyToken_1.verifyToken, forgotPassword_1.passwordValidation, this.authController.verifyForgotPassword);
        this.route.post("/signin", this.authController.signIn);
        this.route.get("/keeplogin", verifyToken_1.verifyToken, this.authController.keepLogin);
    }
    getRouter() {
        return this.route;
    }
}
exports.AuthRouter = AuthRouter;
