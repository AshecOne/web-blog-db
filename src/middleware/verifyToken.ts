import { NextFunction, Request, Response } from "express";
import { verify, TokenExpiredError } from "jsonwebtoken";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header not found" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token not found" });
    }

    console.log("Token received:", token);
    const decoded = verify(token, process.env.TOKEN_KEY || "secret");
    console.log("Decoded token:", decoded);
    res.locals.decript = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};
