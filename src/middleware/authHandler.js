import db from "../db/index.js";
import { users } from "../db/schema.js";
import { AppError } from "./errorHandler.js";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import { generateJwtToken } from "../lib/utils.js";
import { compareHashed, hashText } from "../lib/bcrypt.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
          throw new AppError("Unauthorized", 401);
        }

        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await db.select().from(users).where({ id: decodedRefresh.userId });

        if (user.length === 0 || !compareHashed(refreshToken, user[0].refreshToken)) {
          throw new AppError("Unauthorized", 401);
        }

        const { accessToken, refreshToken: newRawRefreshToken } = await generateJwtToken(user[0].id);
        const newHashedRefreshToken = hashText(newRawRefreshToken);

        await db.update(users).set({ refreshToken: newHashedRefreshToken }).where({ id: user[0].id });

        req.user = { userId: user[0].id };
        req.accessToken = accessToken;
        return next();
      }
      console.log(error);
      throw new AppError("Unauthorized", 401);
    }
  } catch (error) {
    next(error);
  }
};
