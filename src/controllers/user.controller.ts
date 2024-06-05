import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";

export class UserController {
  async updateProfile(req: Request, resp: Response) {
    try {
      const { id } = resp.locals.user;
      const { username, email } = req.body;
  
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { username, email },
      });
  
      return resp.status(200).send({
        rc: 200,
        success: true,
        message: "User profile updated successfully",
        data: updatedUser,
      });
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
