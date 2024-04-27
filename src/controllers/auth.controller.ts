import { genSalt, hash, compareSync } from "bcrypt";
import prisma from "../prisma";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { trasnporter } from "../lib/nodemailer";

export class AuthController {
  async registerUser(req: Request, resp: Response) {
    try {
      const { username, email, password, role } = req.body;
      console.log(req.body);

      const existingUser = await prisma.user.findUnique({
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
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      // Generate verification token
      const verificationToken =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Save verification token to the user record
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashPassword,
          role,
          verificationToken,
        } as any,
      });

      // Send verification email
      await trasnporter.sendMail({
        from: process.env.MAIL_SENDER,
        to: email,
        subject: "Verify your email address",
        html: `
    <p>Welcome, ${username}!</p>
    <p>Please click the following link to verify your email address:</p>
    <a href="${process.env.CLIENT_URL}/verify-email?token=${verificationToken}">Verify Email</a>
  `,
      });

      return resp.status(201).send({
        rc: 201,
        success: true,
        message: "User registered successfully",
        data: newUser,
      });
    } catch (error) {
      console.log(error);
      return resp.status(500).send(error);
    }
  }

  async verifyEmail(req: Request, resp: Response) {
    try {
      const { token } = req.query;

      // Find user by verification token
      const user = await prisma.user.findFirst({
        where: { verificationToken: token as string },
      });

      if (!user) {
        return resp.status(400).send({
          rc: 400,
          success: false,
          message: "Invalid verification token",
        });
      }

      // Update user's verification status
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null,
        },
      });

      return resp.status(200).send({
        rc: 200,
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      console.log(error);
      return resp.status(500).send(error);
    }
  }

  async signIn(req: Request, resp: Response) {
    try {
      console.log("Request body:", req.body);
      const { emailOrUsername, password } = req.body;
      console.log("Email or username received:", emailOrUsername);
      // Cari pengguna berdasarkan email atau username
      const findUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
        },
      });

      console.log(findUser);
      if (!findUser?.isVerified) {
        return resp.status(403).send({
          success: false,
          message: "Please verify your email before logging in.",
        });
      }

      if (findUser) {
        // Periksa kecocokan password
        const isPasswordValid = await compareSync(password, findUser.password);

        if (!isPasswordValid) {
          const differentDay = findUser.updatedAt
            ? Date.now() > new Date(findUser.updatedAt).getTime()
            : true;

          if (differentDay) {
            await prisma.user.update({
              where: { id: findUser?.id },
              data: { limitWrongPassword: 0 },
            });
          }

          if (
            findUser.limitWrongPassword <
            Number(process.env.MAX_FORGOT_PASSWORD)
          ) {
            const countLimit = findUser.limitWrongPassword + 1;

            await prisma.user.update({
              where: { id: findUser?.id },
              data: { limitWrongPassword: countLimit },
            });

            if (countLimit >= Number(process.env.MAX_FORGOT_PASSWORD)) {
              throw new Error(
                `Your account is suspended. Please contact the admin.`
              );
            } else {
              throw new Error(
                `Invalid password. Attempt ${countLimit}/${process.env.MAX_FORGOT_PASSWORD}`
              );
            }
          } else {
            throw new Error(
              `Your account is suspended. Please contact the admin.`
            );
          }
        }

        console.log(process.env.TOKEN_KEY);

        const token = sign(
          { id: findUser.id, role: findUser.role },
          process.env.TOKEN_KEY || "secret",
          { expiresIn: "24h" }
        );

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
      } else {
        return resp.status(404).send({
          rc: 404,
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        if (error.message.startsWith("Invalid password")) {
          return resp.status(401).send({
            rc: 401,
            success: false,
            message: error.message,
          });
        } else if (error.message.startsWith("Your account is suspended")) {
          return resp.status(403).send({
            rc: 403,
            success: false,
            message: error.message,
          });
        }
      } else {
        return resp.status(500).send({
          rc: 500,
          success: false,
          message: "Internal server error",
        });
      }
    }
  }

  async keepLogin(req: Request, resp: Response) {
    try {
      console.log("from verifyToken : ", resp.locals.decript);
      const { id } = resp.locals.decript;

      const isLogin = await prisma.user.findUnique({
        where: { id },
      });
      if (isLogin) {
        const token = sign(
          { id: isLogin.id, role: isLogin.role },
          process.env.TOKEN_KEY || "secret",
          { expiresIn: "24h" }
        );
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
      } else {
        return resp.status(404).send({
          rc: 404,
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      console.log(error);
      return resp.status(500).send(error);
    }
  }
}
