import express, { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware, authorizeAuthor } from "../middleware/protectedRoute";

export class UserRouter {
  private route: Router;
  private userController: UserController;

  constructor() {
    this.route = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.put("/", authMiddleware, authorizeAuthor, this.userController.updateProfile);
  }

  getRouter(): Router {
    return this.route;
  }
}
