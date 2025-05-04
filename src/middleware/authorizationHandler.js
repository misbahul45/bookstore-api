
import db from "../db/index.js";
import { users } from "../db/schema.js";
import { AppError } from "./errorHandler.js";
import jwt from "jsonwebtoken";
import 'dotenv/config';

export const authenticateSeller = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
    
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Unauthorized", 401);
        }
    
        const token = authHeader.split(" ")[1];
        const seller= jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user= await db.select().from(users).where({ id: seller.userId }).limit(1);
        if (user.length === 0) {
            throw new AppError("Unauthorized", 401);
        }

        if(user[0].role !== "seller"){
            throw new AppError("Unauthorized", 401);
        }

        next();
    } catch (error) {
        next(error);
    }
}

export const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
    
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Unauthorized", 401);
        }
    
        const token = authHeader.split(" ")[1];
        const admin= jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user= await db.select().from(users).where({ id: admin.userId }).limit(1);
        if (user.length === 0) {
            throw new AppError("Unauthorized", 401);
        }

        if(user[0].role !== "admin"){
            throw new AppError("Unauthorized", 401);
        }

        next();
    } catch (error) {
        next(error);
    }
}