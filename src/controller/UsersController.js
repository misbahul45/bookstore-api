import { count } from "drizzle-orm";
import db from "../db/index.js";
import { users } from "../db/schema.js";
import { AppError } from "../middleware/errorHandler.js";
import { UsersSchema } from "../schema/UsersSchema.js";
import { hashText } from "../lib/bcrypt.js";

export class UsersController{
    static async createUser(data) {
        try {
            await UsersSchema.create.parseAsync(data);

            await db.insert(users).values({
                ...data,
                isActive: true,
                isVerified: true,
            })
            
            return { 
                status: 201,
                message: 'User created successfully' 
            };
        } catch (error) {
            throw error;
        }
    }

    static async getUsers(page, limit) {
        try {
             await UsersSchema.getUsers.safeParseAsync({ page, limit });

            const totalUsersResult = await db.select({ count:count() }).from(users);

            const totalUsers = totalUsersResult[0]?.count || 0;

            const usersList = await db.select().from(users).limit(limit).offset((page - 1) * limit);
            return {
                status: 200,
                message: 'Users retrieved successfully',
                data: {
                    meta: {
                        page: parseInt(page, 10),
                        limit: parseInt(limit, 10),
                        total: totalUsers,
                        totalPage: Math.ceil(totalUsers / limit)
                    },
                    data: usersList
                }
            };
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(id){
        try{
            await UsersSchema.getUserById.safeParseAsync({ id });
            
            const user=await db.select().from(users).where({id});
            if(user.length===0){
                throw new AppError("User not found", 404);
            }
            
            return {
                status: 200,
                message: 'User retrieved successfully',
                data: user[0]
            };
        }catch(error){
            throw error;
        }
    }

    static async updateUser(id, data){
        try{
            await UsersSchema.updateUser.safeParseAsync({ ...data });

            data.password = hashText(data.password);
            const user=await db.update(users).set(data).where({id});
            if(user.length===0){
                throw new AppError("User not found", 404);
            }
            
            return {
                status: 204,
                message: 'User updated successfully',
            };
        }catch(error){
            throw error;
        }
    }

    static async deleteUser(id){
        try{
            await UsersSchema.deleteUser.safeParseAsync({ id });

            
            const user=await db.delete(users).where({id});
            if(user.length===0){
                throw new AppError("User not found", 404);
            }
            
            return {
                status: 204,
                message: 'User deleted successfully',
            };
        }catch(error){
            throw error;
        }
    }
}