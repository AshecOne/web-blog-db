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
    createArticle(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const user = yield prisma_1.default.user.findUnique({
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
                const category = yield prisma_1.default.category.findUnique({
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
                const newArticle = yield prisma_1.default.article.create({
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
            }
            catch (error) {
                console.log(error);
                return resp.status(500).send({
                    rc: 500,
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    updateArticle(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const updateData = req.body;
            try {
                const updatedArticle = yield prisma_1.default.article.update({
                    where: { id: Number(id) },
                    data: updateData,
                });
                return resp.status(200).send({
                    rc: 200,
                    success: true,
                    message: "Update Article Success",
                    data: updatedArticle,
                });
            }
            catch (error) {
                console.error(error);
                return resp.status(500).send({
                    rc: 500,
                    success: false,
                    message: "Failed to Update Article",
                });
            }
        });
    }
    getArticlesByAuthorId(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorId } = req.params;
            try {
                const articles = yield prisma_1.default.article.findMany({
                    where: { authorId: Number(authorId) },
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
    deleteArticle(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield prisma_1.default.article.delete({
                    where: { id: Number(id) },
                });
                return resp.status(200).send({
                    rc: 200,
                    success: true,
                    message: "Delete Article Success",
                });
            }
            catch (error) {
                console.error(error);
                return resp.status(500).send({
                    rc: 500,
                    success: false,
                    message: "Failed to Delete Article",
                });
            }
        });
    }
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
}
exports.ArticleController = ArticleController;
