import { users } from "../db/schema.js";
import { AppError } from "../middleware/errorHandler.js";
import { hashText, compareHashed } from "../lib/bcrypt.js";
import { generateJwtToken } from "../lib/utils.js";
import { validate } from "../lib/zod.js";
import { AuthSchema } from "../schema/AuthSchema.js";
import db from "../db/index.js";
import 'dotenv/config';
import { v4 as uuid } from 'uuid';
export class AuthController {
  static async signup(data) {
    try {
      const dataUser = await validate(data, AuthSchema.signup);
      dataUser.password = hashText(dataUser.password);
      const isUser = await db.select().from(users).where({
        email: dataUser.email,
      });

      if (isUser.length > 0) {
        throw new AppError("User already exists", 409);
      }
      const generateNameEmail= dataUser.email.split('@')[0];
      dataUser.avatar = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${generateNameEmail}`;

      // Pastikan dataUser.id sudah ada, jika belum, Anda perlu meng-generate ID atau menunggu hasil insert
      dataUser.id = uuid();

      await db.insert(users).values(dataUser);

      const { accessToken, refreshToken: rawRefreshToken } = await generateJwtToken(dataUser.id);
      const hashedRefreshToken = hashText(rawRefreshToken);
      await db.update(users).set({ refreshToken: hashedRefreshToken }).where({ id: dataUser.id });
      return {
        message: "Successfully signed up",
        status: 200,
        data: {
          accessToken,
          refreshToken: rawRefreshToken, 
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(data) {
    try {
     
      data= await validate(data, AuthSchema.refreshToken);
      // Ambil user berdasarkan email atau id, tergantung bagaimana Anda mengidentifikasi refresh token
      const user = await db.select().from(users).where({ email:data.email }).limit(1);

      if (user.length === 0) {
        throw new AppError("User not found", 401);
      }

      // Bandingkan refreshToken yang dikirim dengan yang tersimpan (hash)
      const isMatch = compareHashed(data.refreshToken, user[0].refreshToken);
      if (!isMatch) {
        throw new AppError("Invalid refresh token", 401);
      }

      const { accessToken, refreshToken: newRawRefreshToken } = await generateJwtToken(user[0].id);
      const newHashedRefreshToken = hashText(newRawRefreshToken);

      await db.update(users).set({ refreshToken: newHashedRefreshToken }).where({ id: user[0].id });

      return {
        message: "Successfully refreshed token",
        status: 200,
        data: {
          accessToken,
          refreshToken: newRawRefreshToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async signin(data) {
    try {
      data= await validate(data, AuthSchema.signin);
      const user = await db.select().from(users).where({ email: data.email }).limit(1);
      if (user.length === 0) {
        throw new AppError("User not found", 401);
      }
      const isMatch = compareHashed(data.password, user[0].password);
      if (!isMatch) {
        throw new AppError("Invalid password", 401);
      }

      const { accessToken, refreshToken: rawRefreshToken } = await generateJwtToken(user[0].id);
      const hashedRefreshToken = hashText(rawRefreshToken);
      await db.update(users).set({ refreshToken: hashedRefreshToken }).where({ id: user[0].id });
      return {
        message: "Successfully signed in",
        status: 200,
        data: {
          accessToken,
          refreshToken: rawRefreshToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
