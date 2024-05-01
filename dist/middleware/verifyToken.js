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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        if (!token) {
            return res.status(401).json({ error: "Token not found" });
        }
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_KEY || "secret");
        res.locals.decodedToken = decoded;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).json({ error: "Token expired" });
        }
        return res.status(403).json({ error: "Invalid token" });
    }
});
exports.verifyToken = verifyToken;
