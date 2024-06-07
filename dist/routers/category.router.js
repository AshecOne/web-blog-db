"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRouter = void 0;
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
class CategoryRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.categoryController = new category_controller_1.CategoryController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/", this.categoryController.createCategory);
        this.route.get("/", this.categoryController.fetchCategory);
        this.route.get("/blogs", this.categoryController.fetchBlogCategories);
    }
    getRouter() {
        return this.route;
    }
}
exports.CategoryRouter = CategoryRouter;
