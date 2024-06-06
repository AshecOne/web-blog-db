import { Request, Response } from "express";
import prisma from "../prisma";

export class ArticleController {
  async createArticle(req: Request, resp: Response) {
    try {
      const { title, urlImage, description, categoryId } = req.body;
      const authorId = resp.locals.user.id; // Mengambil authorId dari token yang terautentikasi
      console.log(req.body);

      // Cari User berdasarkan id
      const user = await prisma.user.findUnique({
        where: { id: authorId },
      });

      if (!user) {
        return resp.status(404).send({
          rc: 404,
          success: false,
          message: "User not found",
        });
      }

      // Cari Category berdasarkan id
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return resp.status(404).send({
          rc: 404,
          success: false,
          message: "Category not found",
        });
      }

      // Buat artikel baru
      const newArticle = await prisma.article.create({
        data: {
          title,
          urlImage,
          description,
          categoryId: category.id,
          authorId: user.id,
        },
      });

      return resp.status(201).send({
        rc: 201,
        success: true,
        message: "Article created successfully",
        data: newArticle,
      });
    } catch (error) {
      console.log(error);
      return resp.status(500).send({
        rc: 500,
        success: false,
        message: "Internal server error",
      });
    }
  }

  async updateArticle(req: Request, resp: Response) {
    const { id } = req.params;
    const { title, description, urlImage, categoryId } = req.body;

    try {
      const article = await prisma.article.findUnique({
        where: { id: Number(id) },
      });

      if (!article) {
        return resp.status(404).send({
          rc: 404,
          success: false,
          message: "Article not found",
        });
      }

      if (article.authorId !== resp.locals.user.id) {
        return resp.status(403).send({
          rc: 403,
          success: false,
          message: "You are not authorized to update this article",
        });
      }

      const updatedArticle = await prisma.article.update({
        where: { id: Number(id) },
        data: {
          title,
          description,
          urlImage,
          categoryId,
        },
      });

      return resp.status(200).send({
        rc: 200,
        success: true,
        message: "Update Article Success",
        data: updatedArticle,
      });
    } catch (error) {
      console.error("Error updating article:", error);
      return resp.status(500).send({
        rc: 500,
        success: false,
        message: "Failed to Update Article",
      });
    }
  }

  async getArticlesByAuthorId(req: Request, resp: Response) {
    try {
      const authorId = resp.locals.user.id; // Mengambil authorId dari token yang terautentikasi

      const articles = await prisma.article.findMany({
        where: { authorId: Number(authorId) },
      });

      return resp.status(200).send({
        rc: 200,
        success: true,
        message: "Articles retrieved successfully",
        data: articles,
      });
    } catch (error) {
      console.error(error);
      return resp.status(500).send({
        rc: 500,
        success: false,
        message: "Failed to retrieve articles",
      });
    }
  }

  async deleteArticle(req: Request, resp: Response) {
    const { id } = req.params; // Mengambil ID artikel dari parameter URL

    try {
      const article = await prisma.article.findUnique({
        where: { id: Number(id) },
      });

      if (!article) {
        return resp.status(404).send({
          rc: 404,
          success: false,
          message: "Article not found",
        });
      }

      if (article.authorId !== resp.locals.user.id) {
        return resp.status(403).send({
          rc: 403,
          success: false,
          message: "You are not authorized to delete this article",
        });
      }

      await prisma.article.delete({
        where: { id: Number(id) },
      });

      return resp.status(200).send({
        rc: 200,
        success: true,
        message: "Delete Article Success",
      });
    } catch (error) {
      console.error(error);
      return resp.status(500).send({
        rc: 500,
        success: false,
        message: "Failed to Delete Article",
      });
    }
  }

  async getAllArticles(req: Request, resp: Response) {
    try {
      const articles = await prisma.article.findMany({
        include: {
          author: true,
          category: true,
        },
      });

      return resp.status(200).send({
        rc: 200,
        success: true,
        message: "Articles retrieved successfully",
        data: articles,
      });
    } catch (error) {
      console.error(error);
      return resp.status(500).send({
        rc: 500,
        success: false,
        message: "Failed to retrieve articles",
      });
    }
  }

  async searchArticles(req: Request, resp: Response) {
    const { query, startDate, endDate } = req.query;
  
    try {
      const whereClause: any = {
        OR: [
          { title: { contains: query as string } },
          { author: { username: { contains: query as string } } },
          { category: { title: { contains: query as string } } },
        ],
      };
  
      if (startDate && endDate) {
        whereClause.createdAt = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }
  
      const articles = await prisma.article.findMany({
        where: whereClause,
        include: {
          author: true,
          category: true,
        },
        take: 3,
      });
  
      return resp.status(200).send({
        rc: 200,
        success: true,
        message: "Articles searched successfully",
        data: articles,
      });
    } catch (error) {
      console.error(error);
      return resp.status(500).send({
        rc: 500,
        success: false,
        message: "Failed to search articles",
      });
    }
  }
}
