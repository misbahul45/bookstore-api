/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Operasi pengelolaan gambar (upload & hapus) menggunakan Cloudinary
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CloudinaryImage:
 *       type: object
 *       properties:
 *         public_id:
 *           type: string
 *           description: ID unik gambar di Cloudinary
 *         url:
 *           type: string
 *           format: uri
 *           description: URL akses gambar
 * 
 *   examples:
 *     ImageUploadSuccess:
 *       value:
 *         status: 200
 *         message: "Image uploaded successfully"
 *         data:
 *           public_id: "users/abc123"
 *           url: "https://res.cloudinary.com/demo/image/upload/v123456789/users/abc123.jpg"
 *     ImageDeleteSuccess:
 *       value:
 *         status: 200
 *         message: "Image deleted successfully"
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload gambar ke Cloudinary
 *     description: |
 *       Mengunggah file gambar ke Cloudinary dan mengembalikan URL serta public_id.
 *       File harus berupa gambar (PNG, JPEG, dll.)
 *     tags: [Uploads]
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
 *                 description: File gambar yang akan diupload
 *     responses:
 *       200:
 *         description: Berhasil mengupload gambar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Image uploaded successfully"
 *                 data:
 *                   $ref: '#/components/schemas/CloudinaryImage'
 *           examples:
 *             success:
 *               $ref: '#/components/examples/ImageUploadSuccess'
 *       400:
 *         description: Tidak ada file diupload
 *         content:
 *           application/json:
 *             example:
 *               message: "No file uploaded"
 *       500:
 *         description: Gagal upload gambar
 *         content:
 *           application/json:
 *             example:
 *               message: "Image upload failed"
 */

/**
 * @swagger
 * /upload/{public_id}:
 *   delete:
 *     summary: Hapus gambar dari Cloudinary
 *     description: |
 *       Menghapus gambar berdasarkan public_id yang tersimpan di Cloudinary.
 *       Pastikan public_id sesuai dengan format Cloudinary (misal: users/abc123).
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: public_id
 *         required: true
 *         schema:
 *           type: string
 *           description: Public ID Cloudinary dari gambar yang ingin dihapus
 *     responses:
 *       200:
 *         description: Berhasil menghapus gambar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Image deleted successfully"
 *           examples:
 *             success:
 *               $ref: '#/components/examples/ImageDeleteSuccess'
 *       400:
 *         description: Public ID tidak diberikan
 *         content:
 *           application/json:
 *             example:
 *               message: "No public_id provided"
 *       404:
 *         description: Gambar tidak ditemukan di Cloudinary
 *         content:
 *           application/json:
 *             example:
 *               message: "Image not found"
 *       500:
 *         description: Gagal menghapus gambar
 *         content:
 *           application/json:
 *             example:
 *               message: "Failed to delete image"
 */