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
exports.UserController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    signUp(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password, role } = req.body;
                const existingUser = yield prisma_1.default.user.findUnique({
                    where: { email },
                });
                if (existingUser) {
                    return resp.status(400).send({
                        rc: 400,
                        success: false,
                        message: "Email has been registered",
                    });
                }
                const newUser = yield prisma_1.default.user.create({
                    data: {
                        username,
                        email,
                        password,
                        role,
                    },
                });
                return resp.status(201).send({
                    rc: 201,
                    success: true,
                    message: "User registered successfully",
                    data: newUser,
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
    signIn(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.query.email;
                const password = req.query.password;
                console.log("Received email:", email);
                console.log("Received password:", password);
                // Cari pengguna berdasarkan email
                const user = yield prisma_1.default.user.findUnique({
                    where: { email },
                });
                if (!user) {
                    return resp.status(404).send({
                        rc: 404,
                        success: false,
                        message: "User not found",
                    });
                }
                // Periksa kecocokan password
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    return resp.status(401).send({
                        rc: 401,
                        success: false,
                        message: "Invalid password",
                    });
                }
                // Jika email dan password cocok, kirim data pengguna sebagai respons
                return resp.status(200).send({
                    rc: 200,
                    success: true,
                    message: "Sign in successful",
                    data: user,
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
}
exports.UserController = UserController;
