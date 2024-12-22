import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AuthError } from "./authErrorHandler";

// Define a validation error structure
interface ValidationError {
    field: string;
    message: string;
    code?: string;
    value?: unknown;
}

// Custom error types
interface AppError extends Error {
    status?: number;
    code?: string;
    validationErrors?: ValidationError[];
}

// Create custom error class
export class CustomError extends Error implements AppError {
    constructor(
        message: string,
        public status: number = 500,
        public code?: string,
        public validationErrors?: ValidationError[]
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}


// Custom error for unhandled rejections
export class UnhandledRejectionError extends Error implements AppError {
    status: number;
    code: string;
    
    constructor(error: Error | string) {
        super(typeof error === 'string' ? error : error.message);
        this.name = 'UnhandledRejectionError';
        this.status = 500;
        this.code = 'UNHANDLED_REJECTION';
        
        if (error instanceof Error) {
            this.stack = error.stack;
        } else {
            Error.captureStackTrace(this, UnhandledRejectionError);
        }
    }
}


// Type-safe error middleware
export const errorHandler: ErrorRequestHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        code: err.code,
        validationErrors: err.validationErrors
    });
    

    // Handle CSRF errors
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({
            success: false,
            message: "Invalid or missing CSRF token"
        });
        return;
    }


    // Handle validation errors
    if (err.code === 'VALIDATION_ERROR') {
        res.status(400).json({
            success: false,
            message: err.message,
            errors: err.validationErrors
        });
        return;
    }

    // if (err instanceof AuthError) {
    //     res.status(err.status).json({
    //         success: false,
    //         message: err.message,
    //         code: err.code,
    //         ...(process.env.NODE_ENV === 'development' && {
    //             stack: err.stack
    //         })
    //     });
    //     return;
    // }

    // Handle unhandled rejections
    if (err instanceof UnhandledRejectionError || err.code === 'UNHANDLED_REJECTION') {
        const statusCode = err.status || 500;
        res.status(statusCode).json({
            success: false,
            message: err.message || 'An unexpected error occurred',
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack
            })
        });
        return;
    }

    // Default error response
    const statusCode = err.status || 500;
    const message = statusCode === 500 && process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            code: err.code
        })
    });
};


// Custom error creation utilities
export const createError = {
    validation: (message: string, errors: ValidationError[]) => 
        new CustomError(message, 400, "VALIDATION_ERROR", errors),
    
    notFound: (message: string) => 
        new CustomError(message, 404, "NOT_FOUND"),
    
    unauthorized: (message: string = "Unauthorized") => 
        new CustomError(message, 401, "UNAUTHORIZED"),
    
    forbidden: (message: string = "Forbidden") => 
        new CustomError(message, 403, "FORBIDDEN"),
    
    internal: (message: string = "Internal server error") => 
        new CustomError(message, 500, "INTERNAL_ERROR")
};