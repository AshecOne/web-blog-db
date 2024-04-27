import express, { Router } from "express";
import { ArticleController } from "../controllers/article.controller";

export class ArticleRouter {
  private route: Router;
  private articleController: ArticleController;

  constructor() {
    this.route = Router();
    this.articleController = new ArticleController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/", this.articleController.createArticle);
    this.route.put("/:id", this.articleController.updateArticle);
    this.route.delete("/:id", this.articleController.deleteArticle);
    this.route.get("/:authorId", this.articleController.getArticlesByAuthorId);
    this.route.get("/", this.articleController.getAllArticles);
  }

  getRouter(): Router {
    return this.route;
  }
}
