import { z } from "zod";

export class UsersSchema {
    static create=z.object({
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
        role: z.enum(['admin', 'user', 'seller']).default('user'),
    });

    static update=z.object({
        name: z.string().optional(),
        email: z.string().email({ message: "Invalid email address" }).optional(),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }).optional(),
        role: z.enum(['admin', 'user']).default('user').optional(),
    });

    static delete=z.object({
        userId: z.string().min(1, { message: "User ID is required" }),
    });

    static get=z.object({
        userId: z.string().min(1, { message: "User ID is required" }),
    });

    static getUsers=z.object({
        page: z.number().min(1, { message: "Page number must be at least 1" }).default(1),
        limit: z.number().min(1, { message: "Limit must be at least 1" }).default(10),
    });
}