import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";

export class UserController {
  async signUp(req: Request, resp: Response) {
    try {
      const { username, email, password, role } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return resp.status(400).send({
          rc: 400,
          success: false,
          message: "Email has been registered",
        });
      }

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password,
          role,
        } as any,
      });

      return resp.status(201).send({
        rc: 201,
        success: true,
        message: "User registered successfully",
        data: newUser,
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

  async signIn(req: Request, resp: Response) {
    try {
      const email = req.query.email as string;
      const password = req.query.password as string;

      console.log("Received email:", email);
      console.log("Received password:", password);

      // Cari pengguna berdasarkan email
      const user = await prisma.user.findUnique({
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
      const isPasswordValid = await bcrypt.compare(password, user.password);
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
