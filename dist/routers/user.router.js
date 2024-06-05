"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const protectedRoute_1 = require("../middleware/protectedRoute");
class UserRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.userController = new user_controller_1.UserController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.put("/", protectedRoute_1.authMiddleware, protectedRoute_1.authorizeAuthor, this.userController.updateProfile);
    }
    getRouter() {
        return this.route;
    }
}
exports.UserRouter = UserRouter;
