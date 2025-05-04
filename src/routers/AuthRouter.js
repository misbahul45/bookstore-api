import { Router } from "express";
import { AuthController } from "../controller/AuthController.js";
import { authenticateUser } from "../middleware/authHandler.js";
import { users } from "../db/schema.js";
import db from "../db/index.js";
import { httpLogger } from "../lib/winston.js";
import sendEmail from "../lib/mail.js";


class AuthRouter {
    router;
    constructor() {
      this.router = Router();
      this.routes();
    }
    routes() {
      this.router.post('/signin', this.signin);
      this.router.post('/signup', this.signup);
      this.router.get('/profile', authenticateUser,this.profile);
      this.router.post('/refresh-token', this.refreshToken);
      this.router.post('/forgot-password', this.forgotPassword);
      this.router.post('/reset-password', this.resetPassword);
      this.router.post('/verify-otp', this.verifyOtp);
      this.router.delete('/logout', authenticateUser,this.logout);
    }

    async signin(req, res, next){
        try {
          const result=await AuthController.signin(req.body);
          res.cookie("refreshToken", result.data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, 
          })
          res.status(200).json(result);
          httpLogger.info(`User ${result.data.user.username} logged in`);

        } catch (error) {
          next(error);
        }
    }

    async signup(req, res, next){
        try {
          const result=await AuthController.signup(req.body);

          if(result.status === 201) {
            await sendEmail(req.body.email, req.body.username, result.data.otp)
          }
          res.status(201).json({
            status: result.status,
            message: result.message,
          });
        } catch (error) {
          next(error);
        }
    }

    async refreshToken(req, res, next){
      try {
        const result=await AuthController.refreshToken(req.body);
        res.cookie("refreshToken", result.data.refreshToken, {
           httpOnly: true,
           secure: process.env.NODE_ENV === "production",
           sameSite: "strict",
           maxAge: 30 * 24 * 60 * 60 * 1000,
         });
        res.status(200).json(result);

        httpLogger.info(`User ${result.data.user.username} refreshed token`);
      } catch (error) {
        next(error);
      }
    }


    async verifyOtp(req, res, next) {
      try {
        const { email, otp } = req.body;

        const result = await AuthController.verifyOtp({ email, otp:otp.toString().trim() });
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }

    async profile(req, res, next) {
      try {
        const userId = req.user.userId;
    
        const [user] = await db
          .select({
            id: users.id,
            username: users.username,
            email: users.email,
            avatar: users.avatar,
            role: users.role,
            isActive: users.isActive,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          })
          .from(users)
          .where({ id: userId });
    
        if (!user) {
          throw new AppError("User not found", 404);
        }
    
        res.status(200).json({
          status: 200,
          message: "User profile retrieved successfully",
          data: user,
        });
      } catch (error) {
        next(error);
      }
    }
    
    async logout(req, res, next){
        try {
          const userId=req.user.userId;
          await db.update(users).set({ refreshToken: null }).where({ id: userId });
          res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
          res.status(200).json({
            status: 200,
            message: "Successfully logged out",
          });
        } catch (error) {
          next(error);
        }
    }

    async forgotPassword(req, res, next) {
      try {
        const { email } = req.body;
        const result = await AuthController.forgotPassword({
          email,
        });
        if (result.status === 200) {
          await sendEmail(email, result.data.username, result.data.otp);
        }
        res.status(200).json({
          status: result.status,
          message: result.message,
        });
      } catch (error) {
        next(error);
      }
    }

    async resetPassword(req, res, next) {
      try {
        const result = await AuthController.resetPassword(req.body);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }

  }

 export default new AuthRouter().router;