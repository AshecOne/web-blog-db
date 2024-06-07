import { Request, Response } from "express";
import prisma from "../prisma";

export class BlogController {
  async createBlog(req: Request, resp: Response) {
    const { urlImage, author, description, linkUrl, categoryId } = req.body;

    try {
      const blog = await prisma.blog.create({
        data: {
          urlImage,
          author,
          description,
          linkUrl,
          categoryId,
        },
      });

      return resp.status(201).send({
        rc: 201,
        success: true,
        message: "Create Blog Success",
        data: blog,
      });
    } catch (error) {
      console.error(error);
      return resp.status(500).send({
        rc: 500,
        success: false,
        message: "Failed to create blog",
      });
    }
  }

  async fetchBlogs(req: Request, resp: Response) {
    try {
      const blogs = await prisma.blog.findMany({
        include: {
          category: true,
        },
      });

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
