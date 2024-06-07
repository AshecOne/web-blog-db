import express, { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

export class CategoryRouter {
  private route: Router;
  private categoryController: CategoryController;

  constructor() {
    this.route = Router();
    this.categoryController = new CategoryController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/", this.categoryController.createCategory);
    this.route.get("/", this.categoryController.fetchCategory);
    this.route.get("/blogs", this.categoryController.fetchBlogCategories);
  }

  getRouter(): Router {
    return this.route;
  }
}
