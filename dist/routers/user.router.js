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
        this.route.post("/signup", this.userController.signUp);
        this.route.get("/signin", this.userController.signIn);
    }
    getRouter() {
        return this.route;
    }
}
exports.UserRouter = UserRouter;
