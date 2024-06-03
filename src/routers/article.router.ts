import express, { Router } from "express";
import { ArticleController } from "../controllers/article.controller";
import { authMiddleware, authorizeAuthor } from "../middleware/protectedRoute";

export class ArticleRouter {
  private route: Router;
  private articleController: ArticleController;

  constructor() {
    this.route = Router();
    this.articleController = new ArticleController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/", authMiddleware, authorizeAuthor, this.articleController.createArticle);
    this.route.put("/:id", authMiddleware, authorizeAuthor, this.articleController.updateArticle);
    this.route.delete("/:id", authMiddleware, authorizeAuthor,this.articleController.deleteArticle);
    this.route.get("/:authorId", authMiddleware, authorizeAuthor,this.articleController.getArticlesByAuthorId);
    this.route.get("/", this.articleController.getAllArticles);
  }

  getRouter(): Router {
    return this.route;
  }
}
