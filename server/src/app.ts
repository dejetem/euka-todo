import express, { Express, Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import helmet from "helmet";
import cors from 'cors';
import todoRoutes from "./infrastructure/routes/todoRoutes";
import authRoutes from "./infrastructure/routes/authRoutes";
import { errorHandler } from "./infrastructure/middleware/errorHandler";


// Load environment variables
dotenv.config();

const app: Express = express();

// Security middleware
app.use(helmet()); // Add security headers
app.use(express.json({ limit: '10kb' })); // Limit request size
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    cors({
        origin: 'http://localhost:3000', // Adjust this to your frontend's domain
        credentials: true,  // Allow credentials (cookies) to be sent
    })
);

// CSRF protection setup
const csrfProtection = csrf({
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        httpOnly: true
    }
});


// Apply CSRF protection to all routes
app.use((req: Request, res: Response, next: NextFunction) => {
    csrfProtection(req, res, next);
});

// Middleware to send CSRF token to the client
app.use((req: Request, res: Response, next: NextFunction) => {

    if (req.csrfToken) {
       
        res.cookie('XSRF-TOKEN', req.csrfToken(), {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
    }
    next();
});


// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

// 404 handler
app.use("*", (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});





// Error handler middleware registration
app.use(errorHandler);

// Graceful shutdown handler
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Performing graceful shutdown...');
    // Add cleanup logic here
    process.exit(0);
});


export default app;
