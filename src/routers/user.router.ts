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
    this.route.put(
      "/",
      this.userController.updateProfile
    );
    this.route.post(
      "/",
      this.userController.createArticle
    );
    this.route.put(
      "/:id",
      this.userController.updateArticle
    );
    this.route.delete(
      "/:id",
      this.userController.deleteArticle
    );
    this.route.get(
      "/:authorId",
      this.userController.getArticlesByAuthorId
    );
  }

  getRouter(): Router {
    return this.route;
  }
}
