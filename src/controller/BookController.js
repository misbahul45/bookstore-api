import db from "../db/index.js";
import { books } from "../db/schema.js";
import { validate } from "../lib/zod.js";
import { BookSchema } from "../schema/BookSchema.js";

export class BookController {
  static async createBook(data){
    try {
        data=await validate(data, BookSchema.create);
        await db.insert(books).values(data);
        return {
            status: 201,
            message: "Book created successfully", 
        }
    } catch (error) {
        throw error;
    }
  }

  static async getBooks(take=10, page=1){
    try {
       const skip=(page-1)*take;
       const result=await db.select().from(books).limit(take).offset(skip);
       return {
        status: 200,
        message: "Books fetched successfully",
        data: result,
       }
    }catch(error) {
        throw error;
    }
  }

  static async getBookById(id){
    try {
        const result=await db.select().from(books).where({id});
        if(result.length===0){
            throw new Error("Book not found", 404);
      
        } 
        return {
            status: 200,
            message: "Book fetched successfully",
            data: result[0], 
        }
    } catch (error) {
        throw error; 
    }
  }

  static async updateBook(id, data){
    try {
        data=await validate(data, BookSchema.create.partial());
        const result=await db.update(books).set(data).where({id}); 
        if(result.length===0){
            throw new Error("Book not found", 404); 
        }
        return {
            status: 200,
            message: "Book updated successfully", 
        }
    } catch (error) {
        throw error; 
    }
  }
  static async deleteBook(id){
    try {
        const result=await db.delete(books).where({id});
        if(result.length===0){
            throw new Error("Book not found", 404);
        } 
        return {
            status: 200,
            message: "Book deleted successfully", 
        }
    } catch (error) {
        throw error;
    }
  }
}