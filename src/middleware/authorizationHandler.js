import db from "../db/index.js";
import { users } from "../db/schema.js";
import { AppError } from "./errorHandler.js";
import jwt from "jsonwebtoken";
import 'dotenv/config';

export const authenticateSeller = async (req, res, next) => {
    try {
         const user= req.user;
        if (!user) {
            throw new AppError("Unauthorized", 401);
        }

        if (user.role !== "seller") {
            throw new AppError("User is not seller", 401);
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const authenticateAdmin = async (req, res, next) => {
    try {
        const user= req.user;
        if (!user) {
            throw new AppError("Unauthorized", 401);
        }
        if (user.role !== "admin") {
            throw new AppError("User is not admin", 401);
        }
        next();
    } catch (error) {
        next(error);
    }
}