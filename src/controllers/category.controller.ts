import { Request, Response } from "express";
import prisma from "../prisma";

export class CategoryController {
  async createCategory(req: Request, resp: Response) {
    try {
      const category = await prisma.category.create({
        data: req.body,
      });
      return resp.status(201).send({
        rc: 201,
        success: true,
        message: "Create Category Success",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchCategory(req: Request, resp: Response) {
    try {
      const { id, title } =
        req.query;
      const category = await prisma.category.findMany({
        where: {
          id: id ? String(id) : undefined,
          title: title ? String(title) : undefined,
        },
      });
      return resp.status(201).send({
        rc: 201,
        success: true,
        message: "Fetch Category Success",
        data: category,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchBlogCategories(req: Request, resp: Response) {
    try {
      const { id, title } = req.query;
      const blogCategories = await prisma.blogCategory.findMany({
        where: {
          id: id ? String(id) : undefined,
          title: title ? String(title) : undefined,
        },
      });
      return resp.status(200).send({
        rc: 200,
        success: true,
        message: "Fetch Blog Categories Success",
        data: blogCategories,
      });
    } catch (error) {
      console.log(error);
      return resp.status(500).send({
        rc: 500,
        success: false,
        message: "Failed to fetch blog categories",
      });
    }
  }
}
