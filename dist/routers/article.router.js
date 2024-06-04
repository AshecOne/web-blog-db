"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleRouter = void 0;
const express_1 = require("express");
const article_controller_1 = require("../controllers/article.controller");
const protectedRoute_1 = require("../middleware/protectedRoute");
class ArticleRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.articleController = new article_controller_1.ArticleController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/", protectedRoute_1.authMiddleware, protectedRoute_1.authorizeAuthor, this.articleController.createArticle);
        this.route.put("/:id", protectedRoute_1.authMiddleware, protectedRoute_1.authorizeAuthor, this.articleController.updateArticle);
        this.route.delete("/:id", protectedRoute_1.authMiddleware, protectedRoute_1.authorizeAuthor, this.articleController.deleteArticle);
        this.route.get("/:authorId", protectedRoute_1.authMiddleware, protectedRoute_1.authorizeAuthor, this.articleController.getArticlesByAuthorId);
        this.route.get("/", this.articleController.getAllArticles);
        this.route.get("/search", this.articleController.searchArticles);
    }
    getRouter() {
        return this.route;
    }
}
exports.ArticleRouter = ArticleRouter;
