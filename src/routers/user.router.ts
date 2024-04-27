import express, { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
  private route: Router;
  private userController: UserController;

  constructor() {
    this.route = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.get("/:id", this.userController.getUser);
    this.route.post("/:id", this.userController.updateUser);
  }

  getRouter(): Router {
    return this.route;
  }
}
