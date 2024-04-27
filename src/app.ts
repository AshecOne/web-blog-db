// Define express config
import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { ArticleRouter } from "./routers/article.router";
import { CategoryRouter } from "./routers/category.router";
import { UserRouter } from "./routers/user.router";
import { AuthRouter } from "./routers/auth.router";

const PORT = process.env.PORT;

class App {
  readonly app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
  }

  private configure(): void {
    this.app.use(cors()); // for config accessibility
    this.app.use(express.json()); // for receive req.body
  }

  // to define routes config from routers directory
  private routes(): void {
    const userRouter = new UserRouter();
    const categoryRouter = new CategoryRouter();
    const articleRouter = new ArticleRouter();
    const authRouter = new AuthRouter();

    this.app.get("/api", (req: Request, resp: Response) => {
      return resp.status(200).send("PRISMA API");
    });

    this.app.use("/users", userRouter.getRouter());
    this.app.use("/categories", categoryRouter.getRouter());
    this.app.use("/articles", articleRouter.getRouter());
    this.app.use("/auth", authRouter.getRouter());
  }

  public async start(): Promise<void> {
    this.app.listen(PORT, () => {
      console.log(`PRISMA API RUNNING : http://localhost:${PORT}`);
    });
  }
}

export default App;
