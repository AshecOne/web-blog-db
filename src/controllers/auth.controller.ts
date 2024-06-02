import { genSalt, hash, compareSync } from "bcrypt";
import prisma from "../prisma";
import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { forgotPassword, sendEmail } from "../utils/emailSender";

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

      // Generate otp
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Generate verification token
    const verificationToken = sign(
      { email },
      process.env.TOKEN_KEY || "secret",
      { expiresIn: "1h" }
    );

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
        role,
        verificationToken,
      },
    });

    // Send verification email
    const subject = "Verify your email address";
    const content = null;
    const data = {
      username,
      link: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${verificationToken}`,
    };
    await sendEmail(email, subject, 'templates/register.hbs', data);

      return resp.status(201).send({
        rc: 201,
        success: true,
        message:
          "User registered successfully. Please check your email for verification.",
      });
    } catch (error) {
      console.log(error);
      return resp.status(500).send(error);
    }
  }

  async checkEmailExists(req: Request, resp: Response) {
    try {
      const { email } = req.query;
  
      const user = await prisma.user.findUnique({
        where: { email: email as string },
      });
  
      if (user) {
        return resp.status(200).send({
          rc: 200,
          success: true,
          exists: true,
        });
      } else {
        return resp.status(200).send({
          rc: 200,
          success: true,
          exists: false,
        });
      }
    } catch (error) {
      console.log(error);
      return resp.status(500).send(error);
    }
  }

  async verifyEmail(req: Request, resp: Response) {
    try {
      const { token } = req.params;
  
      // Temukan pengguna berdasarkan token verifikasi
      const user = await prisma.user.findFirst({
        where: {
          verificationToken: token,
        },
      });
  
      if (!user) {
        return resp.status(400).send({
          rc: 400,
          success: false,
          message: "Invalid verification token",
        });
      }
  
      // Update status verifikasi pengguna menjadi true
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
          verificationToken: null,
        },
      });
  
      return resp.status(200).send({
        rc: 200,
        success: true,
        message: "Email verified successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      return resp.status(500).send(error);
    }
  }

  async forgotPassword(req: Request, resp: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return resp.status(400).json({ message: "Email is required" });
      }
  
      const findUser = await prisma.user.findUnique({
        where: { email, isVerified: true },
      });
  
      if (!findUser) {
        return resp.status(400).json({ message: "Invalid user" });
      }
  
      const username = findUser.username;
      const token = sign(
        { id: findUser.id, role: findUser.role },
        process.env.TOKEN_KEY || "secret",
        { expiresIn: "1h" } // Waktu kadaluarsa token
      );
  
      const subject = "Reset Password";
      const data = {
        username,
        link: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password/${token}`,
      };
  
      await forgotPassword(email, subject, null, data);
  
      return resp.status(201).json({
        rc: 201,
        success: true,
        message: "Password reset email sent successfully",
      });
    } catch (error) {
      // Cast 'error' to 'any' to access its properties
      const errorMessage =
        (error as any).message || "An unknown error occurred";
      console.error("Forgot password error:", errorMessage);
  
      return resp.status(500).json({
        message: "An error occurred while processing your request",
        error: errorMessage,
      });
    }
  }

  async resetPassword(req: Request, resp: Response) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      // Verifikasi token
      const decodedToken = verify(token, process.env.TOKEN_KEY || "secret") as { id: number };
      const userId = decodedToken.id;

      const findUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!findUser) {
        return resp.status(400).json({ message: "Invalid user" });
      }

      // Hash password
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { password: hashPassword },
      });

      return resp.status(200).json({
        rc: 200,
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return resp.status(500).json({ message: "Internal Server Error" });
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
          OR: [
            { email: emailOrUsername, isVerified: true },
            { username: emailOrUsername, isVerified: true },
          ],
        },
      });

      console.log(findUser);

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
