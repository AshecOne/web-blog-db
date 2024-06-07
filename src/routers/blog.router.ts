import express, { Router } from "express";
import { BlogController } from "../controllers/blog.controller";

export class BlogRouter {
  private route: Router;
  private blogController: BlogController;

  constructor() {
    this.route = Router();
    this.blogController = new BlogController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/", this.blogController.createBlog);
    this.route.get("/", this.blogController.fetchBlogs);
  }

  getRouter(): Router {
    return this.route;
  }
}
