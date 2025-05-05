import { ZodError } from "zod";
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

    if (err instanceof ZodError) {
        const formattedErrors = err.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
        }));
        
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Validation Error",
            errors: formattedErrors,
        });
    }

    if (err.code === 'ER_DUP_ENTRY') {
        const duplicateValue = err.message.match(/Duplicate entry '(.+?)'/)?.[1];
        const fieldName = err.message.match(/for key '(.+?)'/)?.[1];
        return res.status(409).json({
            status: 409,
            success: false,
            message: "Duplicate entry",
            errors: {
                field: fieldName,
                value: duplicateValue,
            },
        });
    }
    

    res.status(statusCode).json({
        status: statusCode, 
        success: false,
        message: err.message || "Internal Server Error",
        ...(err.err && { 
            errors: err.err,
        })
    });

    httpLogger.error(`Error: ${err.message}, Status Code: ${statusCode}, Stack: ${err.stack}`);
    
};
