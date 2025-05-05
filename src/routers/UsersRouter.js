import { Router } from 'express';
import { authenticateUser } from '../middleware/authHandler.js';
import { authenticateAdmin } from '../middleware/authorizationHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { UsersController } from '../controller/UsersController.js';
import { removeSensitiveData } from '../lib/utils.js';

export class UsersRouter {
    router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post('/', authenticateUser, authenticateAdmin, this.createUser);
        this.router.get('/', this.getUsers);
        this.router.get('/:id', this.getUserById);
        this.router.patch('/:id', this.updateUser);
        this.router.delete('/:id', authenticateUser, this.deleteUser);
    }


    async createUser(req, res, next) {
        try {
            const result = await UsersController.createUser(req.body);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await UsersController.getUsers(page, limit);
            result.data.data=removeSensitiveData(result.data.data);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new AppError("No id provided", 400);
            }

            const result = await UsersController.getUserById(id);
            result.data=removeSensitiveData(result.data);

            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new AppError("No id provided", 400);
            }

            const result = await UsersController.updateUser(id, req.body);
            result.data=removeSensitiveData(result.data);

            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new AppError("No id provided", 400);
            }

            const result = await UsersController.deleteUser(id);
            result.data=removeSensitiveData(result.data);
            
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new UsersRouter().router;