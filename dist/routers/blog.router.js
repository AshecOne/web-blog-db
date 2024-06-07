"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRouter = void 0;
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
class BlogRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.blogController = new blog_controller_1.BlogController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/", this.blogController.createBlog);
        this.route.get("/", this.blogController.fetchBlogs);
    }
    getRouter() {
        return this.route;
    }
}
exports.BlogRouter = BlogRouter;
