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
exports.CategoryController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class CategoryController {
    createCategory(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield prisma_1.default.category.create({
                    data: req.body,
                });
                return resp.status(201).send({
                    rc: 201,
                    success: true,
                    message: "Create Category Success",
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchCategory(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, title } = req.query;
                const category = yield prisma_1.default.category.findMany({
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
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchBlogCategories(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, title } = req.query;
                const blogCategories = yield prisma_1.default.blogCategory.findMany({
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
            }
            catch (error) {
                console.log(error);
                return resp.status(500).send({
                    rc: 500,
                    success: false,
                    message: "Failed to fetch blog categories",
                });
            }
        });
    }
}
exports.CategoryController = CategoryController;
