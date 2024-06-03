"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAuthor = exports.authMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    console.log("Token from header:", token);
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decodedToken = (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_KEY || "secret");
        res.locals.user = decodedToken;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
exports.authMiddleware = authMiddleware;
const authorizeAuthor = (req, res, next) => {
    const user = res.locals.user;
    if (user.role !== "author") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
exports.authorizeAuthor = authorizeAuthor;
