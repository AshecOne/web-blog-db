import { Request, Response } from "express";
import prisma from "../prisma";

export class BlogController {
  async fetchBlogs(req: Request, resp: Response) {
    try {
      const blogs = await prisma.blog.findMany({
        include: {
          category: true,
        },
      });
      console.log("Fetched blogs:", blogs);
      
      return resp.status(200).send({
        rc: 200,
        success: true,
        message: "Blogs retrieved successfully",
        data: blogs,
      });
    } catch (error) {
      console.error(error);
      return resp.status(500).send({
        rc: 500,
        success: false,
        message: "Failed to retrieve blogs",
      });
    }
  }
}
