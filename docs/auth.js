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
  
  /**
   * @swagger
   * /auth/signin:
   *   post:
   *     summary: Sign in a user
   *     description: Authenticate a user and generate access and refresh tokens.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *     responses:
   *       200:
   *         description: Successfully signed in
   *       401:
   *         description: Invalid credentials or inactive user
   */
  async signin(req, res, next) {
    try {
      const result = await AuthController.signin(req.body);
      res.cookie("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json(result);
      httpLogger.info(`User ${result.data.user.username} logged in`);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /auth/signup:
   *   post:
   *     summary: Sign up a new user
   *     description: Create a new user and generate OTP for verification.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *               name:
   *                 type: string
   *                 example: John Doe
   *     responses:
   *       201:
   *         description: Successfully signed up and OTP generated
   *       409:
   *         description: User already exists
   */
  async signup(req, res, next) {
    try {
      const result = await AuthController.signup(req.body);
      if (result.status === 201) {
        await sendEmail(req.body.email, req.body.username, result.data.otp);
      }
      res.status(201).json({
        status: result.status,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /auth/refresh-token:
   *   post:
   *     summary: Refresh authentication tokens
   *     description: Generate a new access and refresh token using the refresh token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               refreshToken:
   *                 type: string
   *                 example: <your-refresh-token>
   *     responses:
   *       200:
   *         description: Successfully refreshed tokens
   *       401:
   *         description: Invalid refresh token or user not found
   */
  async refreshToken(req, res, next) {
    try {
      const result = await AuthController.refreshToken(req.body);
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

  /**
   * @swagger
   * /auth/verify-otp:
   *   post:
   *     summary: Verify OTP sent to the user
   *     description: Verify the OTP entered by the user during sign-up.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               otp:
   *                 type: string
   *                 example: 123456
   *     responses:
   *       200:
   *         description: OTP verified successfully
   *       401:
   *         description: Invalid or expired OTP
   */
  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      const result = await AuthController.verifyOtp({ email, otp: otp.toString().trim() });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /auth/profile:
   *   get:
   *     summary: Get user profile
   *     description: Retrieve the user's profile details.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully retrieved user profile
   *       404:
   *         description: User not found
   */
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

  /**
   * @swagger
   * /auth/logout:
   *   delete:
   *     summary: Logout a user
   *     description: Logs out the user and clears their refresh token.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully logged out
   */
  async logout(req, res, next) {
    try {
      const userId = req.user.userId;
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

  /**
   * @swagger
   * /auth/forgot-password:
   *   post:
   *     summary: Forgot password
   *     description: Generates an OTP for the user to reset their password.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *     responses:
   *       200:
   *         description: Successfully sent OTP
   *       404:
   *         description: User not found
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await AuthController.forgotPassword({ email });
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

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Allows a user to reset their password using a valid OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Successfully reset password
 *       401:
 *         description: OTP expired or not verified
 *       404:
 *         description: User not found
 */

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
