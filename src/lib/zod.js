import { AppError } from "../middleware/errorHandler.js";

function zodErrorFormatter(err) {
    const formattedErrors = {};

    err.issues.forEach((issue) => {
        const field = issue.path.join(".");
        const message = issue.message;

        if (!formattedErrors[field]) {
            formattedErrors[field] = [];
        }

        formattedErrors[field].push(message);
    }); 
    return formattedErrors;
}

export const validate = (data, schema) => {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new AppError("Validation Failed", 400, zodErrorFormatter(result.error));
    }
    return result.data;
};
