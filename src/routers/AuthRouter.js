import { Router } from "express";
import { AuthController } from "../controller/AuthController.js";
import { authenticateUser } from "../middleware/authHandler.js";
import { users } from "../db/schema.js";
import db from "../db/index.js";


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
        } catch (error) {
          next(error);
        }
    }

    async signup(req, res, next){
        try {
          console.log(req.body)
          const result=await AuthController.signup(req.body);
          res.cookie("refreshToken", result.data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          })
          res.status(201).json(result);
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
      } catch (error) {
        next(error);
      }
    }

    async profile(req, res, next){
        try {
           const userId=req.user.userId;
          const user=await db
          .select({
            id:users.id,
            username:users.username,
            email:users.email,
            avatar:users.avatar,
          })
          .from(users)
          .where({ id: userId });

          if(user.length === 0) {
            throw new AppError("User not found", 404);
          }
          res.status(200).json({
            status: 200,
            message: "User profile",
            data: user[0],
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
  }

 export default new AuthRouter().router;