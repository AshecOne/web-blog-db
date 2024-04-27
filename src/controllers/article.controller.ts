import { Request, Response } from "express";
import prisma from "../prisma";

export class ArticleController {
  async createArticle(req: Request, resp: Response) {
    try {
      const { title, urlImage, description, categoryId, authorId } = req.body;
      console.log(req.body);
      if (!authorId) {
        return resp.status(400).send({
          rc: 400,
          success: false,
          message: "Author ID is required",
        });
      }

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
    const updateData = req.body;

    try {
      const updatedArticle = await prisma.article.update({
        where: { id: Number(id) },
        data: updateData,
      });

      return resp.status(200).send({
        rc: 200,
        success: true,
        message: "Update Article Success",
        data: updatedArticle,
      });
    } catch (error) {
      console.error(error);
      return resp.status(500).send({
        rc: 500,
        success: false,
        message: "Failed to Update Article",
      });
    }
  }

  async getArticlesByAuthorId(req: Request, resp: Response) {
    const { authorId } = req.params;

    try {
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
    const { id } = req.params;

    try {
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
}
