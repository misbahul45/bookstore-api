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

    /**
     * @swagger
     * /upload:
     *   post:
     *     summary: Upload an image
     *     description: Uploads an image to Cloudinary and returns the image URL and public_id.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: Image file to upload
     *     responses:
     *       200:
     *         description: Successfully uploaded the image
     *       400:
     *         description: No file uploaded
     *       500:
     *         description: Image upload failed
     */
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
                data: {
                    public_id: result.public_id,
                    url: result.url
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /upload/{public_id}:
     *   delete:
     *     summary: Delete an image
     *     description: Deletes an image from Cloudinary by its public_id.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: public_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Public ID of the image to delete
     *     responses:
     *       200:
     *         description: Successfully deleted the image
     *       400:
     *         description: No public_id provided
     *       404:
     *         description: Image not found
     */
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
