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
exports.AuthController = void 0;
const bcrypt_1 = require("bcrypt");
const prisma_1 = __importDefault(require("../prisma"));
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthController {
    registerUser(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password, role } = req.body;
                console.log(req.body);
                const existingUser = yield prisma_1.default.user.findUnique({
                    where: { email },
                });
                console.log(existingUser);
                if (existingUser) {
                    return resp.status(400).send({
                        rc: 400,
                        success: false,
                        message: "Email has been registered",
                    });
                }
                // hash password
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashPassword = yield (0, bcrypt_1.hash)(password, salt);
                const newUser = yield prisma_1.default.user.create({
                    data: {
                        username,
                        email,
                        password: hashPassword,
                        role,
                    },
                });
                return resp.status(201).send({
                    rc: 201,
                    success: true,
                    message: "User registered successfully.",
                });
            }
            catch (error) {
                console.log(error);
                return resp.status(500).send(error);
            }
        });
    }
    checkEmailExists(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.query;
                const user = yield prisma_1.default.user.findUnique({
                    where: { email: email },
                });
                if (user) {
                    return resp.status(200).send({
                        rc: 200,
                        success: true,
                        exists: true,
                    });
                }
                else {
                    return resp.status(200).send({
                        rc: 200,
                        success: true,
                        exists: false,
                    });
                }
            }
            catch (error) {
                console.log(error);
                return resp.status(500).send(error);
            }
        });
    }
    signIn(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Request body:", req.body);
                const { emailOrUsername, password } = req.body;
                console.log("Email or username received:", emailOrUsername);
                // Cari pengguna berdasarkan email atau username
                const findUser = yield prisma_1.default.user.findFirst({
                    where: {
                        OR: [
                            { email: emailOrUsername },
                            { username: emailOrUsername },
                        ],
                    },
                });
                console.log(findUser);
                if (findUser) {
                    // Periksa kecocokan password
                    const isPasswordValid = yield (0, bcrypt_1.compareSync)(password, findUser.password);
                    if (!isPasswordValid) {
                        const differentDay = findUser.updatedAt
                            ? Date.now() > new Date(findUser.updatedAt).getTime()
                            : true;
                        if (differentDay) {
                            yield prisma_1.default.user.update({
                                where: { id: findUser === null || findUser === void 0 ? void 0 : findUser.id },
                                data: { limitWrongPassword: 0 },
                            });
                        }
                        if (findUser.limitWrongPassword <
                            Number(process.env.MAX_FORGOT_PASSWORD)) {
                            const countLimit = findUser.limitWrongPassword + 1;
                            yield prisma_1.default.user.update({
                                where: { id: findUser === null || findUser === void 0 ? void 0 : findUser.id },
                                data: { limitWrongPassword: countLimit },
                            });
                            if (countLimit >= Number(process.env.MAX_FORGOT_PASSWORD)) {
                                throw new Error(`Your account is suspended. Please contact the admin.`);
                            }
                            else {
                                throw new Error(`Invalid password. Attempt ${countLimit}/${process.env.MAX_FORGOT_PASSWORD}`);
                            }
                        }
                        else {
                            throw new Error(`Your account is suspended. Please contact the admin.`);
                        }
                    }
                    console.log(process.env.TOKEN_KEY);
                    const token = (0, jsonwebtoken_1.sign)({ id: findUser.id, role: findUser.role }, process.env.TOKEN_KEY || "secret", { expiresIn: "24h" });
                    // Jika email/username dan password cocok, kirim data pengguna sebagai respons
                    return resp.status(200).send({
                        rc: 200,
                        success: true,
                        message: "Sign in successful",
                        data: {
                            id: findUser.id,
                            username: findUser.username,
                            email: findUser.email,
                            role: findUser.role,
                        },
                        token,
                    });
                }
                else {
                    return resp.status(404).send({
                        rc: 404,
                        success: false,
                        message: "User not found",
                    });
                }
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    if (error.message.startsWith("Invalid password")) {
                        return resp.status(401).send({
                            rc: 401,
                            success: false,
                            message: error.message,
                        });
                    }
                    else if (error.message.startsWith("Your account is suspended")) {
                        return resp.status(403).send({
                            rc: 403,
                            success: false,
                            message: error.message,
                        });
                    }
                }
                else {
                    return resp.status(500).send({
                        rc: 500,
                        success: false,
                        message: "Internal server error",
                    });
                }
            }
        });
    }
    keepLogin(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("from verifyToken : ", resp.locals.decript);
                const { id } = resp.locals.decript;
                const isLogin = yield prisma_1.default.user.findUnique({
                    where: { id },
                });
                if (isLogin) {
                    const token = (0, jsonwebtoken_1.sign)({ id: isLogin.id, role: isLogin.role }, process.env.TOKEN_KEY || "secret", { expiresIn: "24h" });
                    return resp.status(200).send({
                        rc: 200,
                        success: true,
                        data: {
                            id: isLogin.id,
                            username: isLogin.username,
                            email: isLogin.email,
                            role: isLogin.role,
                        },
                        token,
                    });
                }
                else {
                    return resp.status(404).send({
                        rc: 404,
                        success: false,
                        message: "User not found",
                    });
                }
            }
            catch (error) {
                console.log(error);
                return resp.status(500).send(error);
            }
        });
    }
}
exports.AuthController = AuthController;
