import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";

export class UserController {
  async getUser(req: Request, resp: Response) {
    try {
      
    } catch (error) {
      console.log(error);
      return resp.status(500).send({
        rc: 500,
        success: false,
        message: "Internal server error",
      });
    }
  }

  async updateUser(req: Request, resp: Response) {
    try {
      
    } catch (error) {
      console.log(error);
      return resp.status(500).send({
        rc: 500,
        success: false,
        message: "Internal server error",
      });
    }
  }
}
