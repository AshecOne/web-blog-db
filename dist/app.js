"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Define express config
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const article_router_1 = require("./routers/article.router");
const category_router_1 = require("./routers/category.router");
const user_router_1 = require("./routers/user.router");
const auth_router_1 = require("./routers/auth.router");
const PORT = process.env.PORT;
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.routes();
    }
    configure() {
        this.app.use((0, cors_1.default)()); // for config accessibility
        this.app.use(express_1.default.json()); // for receive req.body
    }
    // to define routes config from routers directory
    routes() {
        const userRouter = new user_router_1.UserRouter();
        const categoryRouter = new category_router_1.CategoryRouter();
        const articleRouter = new article_router_1.ArticleRouter();
        const authRouter = new auth_router_1.AuthRouter();
        this.app.get("/api", (req, resp) => {
            return resp.status(200).send("PRISMA API");
        });
        this.app.use("/users", userRouter.getRouter());
        this.app.use("/categories", categoryRouter.getRouter());
        this.app.use("/articles", articleRouter.getRouter());
        this.app.use("/auth", authRouter.getRouter());
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.listen(PORT, () => {
                console.log(`PRISMA API RUNNING : http://localhost:${PORT}`);
            });
        });
    }
}
exports.default = App;
