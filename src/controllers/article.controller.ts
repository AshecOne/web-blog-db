import { Request, Response } from "express";
import prisma from "../prisma";

export class ArticleController {
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
    console.log("Received search request:", req.query);
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
