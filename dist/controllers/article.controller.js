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
exports.ArticleController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class ArticleController {
    getAllArticles(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const articles = yield prisma_1.default.article.findMany({
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
            }
            catch (error) {
                console.error(error);
                return resp.status(500).send({
                    rc: 500,
                    success: false,
                    message: "Failed to retrieve articles",
                });
            }
        });
    }
    searchArticles(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query, startDate, endDate } = req.query;
            console.log("Received search request:", req.query);
            try {
                const whereClause = {
                    OR: [
                        { title: { contains: query } },
                        { author: { username: { contains: query } } },
                        { category: { title: { contains: query } } },
                    ],
                };
                if (startDate && endDate) {
                    whereClause.createdAt = {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    };
                }
                const articles = yield prisma_1.default.article.findMany({
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
            }
            catch (error) {
                console.error(error);
                return resp.status(500).send({
                    rc: 500,
                    success: false,
                    message: "Failed to search articles",
                });
            }
        });
    }
}
exports.ArticleController = ArticleController;
