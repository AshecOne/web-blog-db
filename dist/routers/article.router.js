"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleRouter = void 0;
const express_1 = require("express");
const article_controller_1 = require("../controllers/article.controller");
class ArticleRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.articleController = new article_controller_1.ArticleController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/", this.articleController.createArticle);
        this.route.put("/:id", this.articleController.updateArticle);
        this.route.delete("/:id", this.articleController.deleteArticle);
        this.route.get("/:authorId", this.articleController.getArticlesByAuthorId);
        this.route.get("/", this.articleController.getAllArticles);
    }
    getRouter() {
        return this.route;
    }
}
exports.ArticleRouter = ArticleRouter;
