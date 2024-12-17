// Define express config
import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { ArticleRouter } from "./routers/article.router";
import { CategoryRouter } from "./routers/category.router";
import { UserRouter } from "./routers/user.router";
import { AuthRouter } from "./routers/auth.router";
import { authMiddleware, authorizeAuthor } from "./middleware/protectedRoute";
import { BlogRouter } from "./routers/blog.router";

const PORT = process.env.PORT;

class App {
  readonly app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
  }

  private configure(): void {
    this.app.use(
      cors({
        origin: [
          "https://ashecone.github.io",
          "https://ashecone.github.io/web-blog",
          "https://ashecone.github.io/web-blog/",
          "http://localhost:3000",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );
    this.app.use(express.json());
  }

  // to define routes config from routers directory
  private routes(): void {
    const userRouter = new UserRouter();
    const categoryRouter = new CategoryRouter();
    const articleRouter = new ArticleRouter();
    const authRouter = new AuthRouter();
    const blogRouter = new BlogRouter();

    this.app.use(
      "/users",
      authMiddleware,
      authorizeAuthor,
      userRouter.getRouter()
    );
    this.app.use("/categories", categoryRouter.getRouter());
    this.app.use("/blogs", blogRouter.getRouter());
    this.app.use("/articles", articleRouter.getRouter());
    this.app.use("/auth", authRouter.getRouter());
    this.app.get("/", (req, res) => {
      res.json({ message: "Blog API is running" });
    });
  }

  public async start(): Promise<void> {
    this.app.listen(PORT, () => {
      console.log(`PRISMA API RUNNING : http://localhost:${PORT}`);
    });
  }
}

export default App;
