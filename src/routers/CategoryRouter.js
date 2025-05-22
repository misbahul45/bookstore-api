import { Router } from "express";
import { authenticateUser } from "../middleware/authHandler.js";
import { authenticateAdmin } from "../middleware/authorizationHandler.js";
import { CategoryController } from "../controller/CategoryController.js";

class UploadRouter {
    router;
    constructor() {
        this.router = Router();
        this.routes();
    }

   routes(){
      this.router.get('/', this.getCategories)
      this.router.get('/:categoryId', this.getCategory)
      this.router.post('/', authenticateUser, authenticateAdmin, this.createCategory)
      this.router.patch('/:categoryId', authenticateUser, authenticateAdmin, this.updateCategory)
      this.router.delete('/:categoryId',  authenticateUser, authenticateAdmin, this.deleteCategory)
   }

   async getCategories(req, res, next){
    try{
        const result=await CategoryController.findAll();
        res.status(result.status).json(result)
    }catch(error){
        next(error)
    }

   }
   async getCategory(req, res, next){
    try{
        const { categoryId }=req.params
        const result=await CategoryController.findOne(categoryId);
        res.status(result.status).json(result)
    }catch(e){
        next(error)
    }

   }
   async createCategory(req, res, next){
    try{
        const result=await CategoryController.create(req.body);
        res.status(result.status).json(result)
    }catch(e){
        next(error)
    }

   }
   async updateCategory(req, res, next){
    try{
        const { categoryId }=req.params
        const result=await CategoryController.update(categoryId, req.body);
        res.status(result.status).json(result)
    }catch(e){
        next(error)
    }

   }
   async deleteCategory(req, res, next){
    try{
       const { categoryId }=req.params
       const result=await CategoryController.delete(categoryId)
        res.status(result.status).json(result)
    }catch(e){
        next(error)
    }

   }
}

export default new UploadRouter().router;