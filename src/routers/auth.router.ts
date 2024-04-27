import express, { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";
import { regisValidation } from "../middleware/vaidator/regis";

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
    this.route.get("/verify-email", this.authController.verifyEmail);
    this.route.post("/signin", this.authController.signIn);
    this.route.get("/keeplogin", verifyToken, this.authController.keepLogin);
  }

  getRouter(): Router {
    return this.route;
  }
}
