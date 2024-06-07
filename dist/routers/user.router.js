"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
class UserRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.userController = new user_controller_1.UserController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.put("/", this.userController.updateProfile);
        this.route.post("/", this.userController.createArticle);
        this.route.put("/:id", this.userController.updateArticle);
        this.route.delete("/:id", this.userController.deleteArticle);
        this.route.get("/", this.userController.getArticlesByAuthorId);
    }
    getRouter() {
        return this.route;
    }
}
exports.UserRouter = UserRouter;
