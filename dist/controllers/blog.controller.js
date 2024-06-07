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
exports.BlogController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class BlogController {
    createBlog(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { urlImage, author, title, description, date, linkUrl, categoryId } = req.body;
            try {
                const blog = yield prisma_1.default.blog.create({
                    data: {
                        urlImage,
                        author,
                        title,
                        description,
                        date: new Date(date),
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
            }
            catch (error) {
                console.error(error);
                return resp.status(500).send({
                    rc: 500,
                    success: false,
                    message: "Failed to create blog",
                });
            }
        });
    }
    fetchBlogs(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield prisma_1.default.blog.findMany({
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
            }
            catch (error) {
                console.error(error);
                return resp.status(500).send({
                    rc: 500,
                    success: false,
                    message: "Failed to retrieve blogs",
                });
            }
        });
    }
}
exports.BlogController = BlogController;
