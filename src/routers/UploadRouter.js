import { Router } from "express";
import { authenticateUser } from "../middleware/authHandler.js";
import { AppError } from "../middleware/errorHandler.js";
import cloudinary from "../lib/cloudinary.js";

class UploadRouter {
    router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post('/',authenticateUser, this.uploadImage);
        this.router.delete('/:public_id',authenticateUser, this.deleteImage);
    }

    async uploadImage(req, res, next) {
        try {
            const file = req.files.file;
            if (!file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: 'auto' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                ).end(file.data);
            });

            if(!result) {
               throw new AppError("Image upload failed", 500); 
            }
            res.status(200).json({
                status: 200,
                message: "Image uploaded successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        } 
    }

    async deleteImage(req, res, next) {
        try {
            const { public_id } = req.params;
            if (!public_id) {
                return res.status(400).json({ message: "No public_id provided" });
            } 
            await cloudinary.uploader.destroy(public_id);
            res.status(200).json({
                status: 200,
                message: "Image deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }

}


export default new UploadRouter().router;