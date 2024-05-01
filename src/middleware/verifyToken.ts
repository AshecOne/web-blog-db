import { NextFunction, Request, Response } from "express";
import { verify, TokenExpiredError } from "jsonwebtoken";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.status(401).json({ error: "Token not found" });
    }

    const decoded = verify(token, process.env.TOKEN_KEY || "secret");
    res.locals.decodedToken = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};