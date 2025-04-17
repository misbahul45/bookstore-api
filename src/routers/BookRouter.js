import { Router } from "express";
import { BookController } from "../controller/BookController.js";
import { authenticateUser } from "../middleware/authHandler.js";

class BookRouter {
    router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post('/', authenticateUser,this.createBook)
        this.router.get('/', this.getBooks)
        this.router.get('/:id', this.getBookById)
        this.router.patch('/:id', authenticateUser,this.updateBook)
        this.router.delete('/:id', authenticateUser,this.deleteBook)
    }

    async createBook(req, res, next) {
        try {
            const result=await BookController.createBook(req.body);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getBooks(req, res, next) {
        try {
            const { page,limit }=req.query;
            const result=await BookController.getBooks(page, limit);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getBookById(req, res, next) {
        try {
            const { id }=req.params;
            const result=await BookController.getBookById(id);
            res.status(result.status).json(result); 
        } catch (error) {
            next(error);
        }
    }

    async updateBook(req, res, next) {
        try {
            const { id }=req.params;
            const result=await BookController.updateBook(id, req.body);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteBook(req, res, next) {
        try {
            const { id }=req.params;
            const result=await BookController.deleteBook(id);
            res.status(result.status).json(result); 
        } catch (error) {
            next(error); 
        }
    }
}

export default new BookRouter().router;