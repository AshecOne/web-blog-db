import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const verifyToken = async (req: Request, resp: Response, next: NextFunction) => {
  try {
    console.log("From header request", req.header("Authorization"));
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        throw "Token not found";
    }
    const checkToken = verify(token, process.env.TOKEN_KEY || "secret");
    console.log(checkToken);

    // meneruskan data hasil token ke middleware
    resp.locals.decript = checkToken;
    next();
  } catch (error) {
    console.log(error);
    return resp.status(500).send(error);
  }
};
