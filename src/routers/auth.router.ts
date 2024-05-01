import express, { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";
import { regisValidation } from "../middleware/vaidator/regis";
import { passwordValidation } from "../middleware/vaidator/forgotPassword";

export class AuthRouter {
  private route: Router;
  private authController: AuthController;

  constructor() {
    this.route = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post(
      "/regis",
      regisValidation,
      this.authController.registerUser
    );
    this.route.post("/verify-email/:token", verifyToken, this.authController.verifyEmail);
    this.route.post("/forgot-password/", this.authController.forgotPassword);
    this.route.post("/verify-password/:token", verifyToken, passwordValidation, this.authController.verifyForgotPassword);
    this.route.post("/signin", this.authController.signIn);
    this.route.get("/keeplogin", verifyToken, this.authController.keepLogin);
  }

  getRouter(): Router {
    return this.route;
  }
}
