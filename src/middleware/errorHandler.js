import { httpLogger } from "../lib/winston.js";

export class AppError extends Error {
    constructor(message, statusCode, err = null) {
        super(message);
        this.statusCode = statusCode;
        this.err = err;
    }
}
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: statusCode, 
        success: false,
        message: err.message || "Internal Server Error",
        ...(err.err && { 
            errors: err.err,
        })
    });

    httpLogger.error(err);
    
};
