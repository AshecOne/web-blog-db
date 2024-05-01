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
    this.route.post("/signup", this.userController.signUp);
    this.route.get("/signin", this.userController.signIn);
  }

  getRouter(): Router {
    return this.route;
  }
}
