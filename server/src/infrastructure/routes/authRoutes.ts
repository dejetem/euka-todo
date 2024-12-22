import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { AuthService } from "../../application/AuthService";
import sanitizeHtml from "sanitize-html";

const router = Router();

// Helper to sanitize inputs
const sanitizeInput = (input: string) => sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });

// Sign-Up Route
router.post(
    "/signup",
    [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return
            }

            let { email, password } = req.body;
            email = sanitizeInput(email);


            const message = await AuthService.register(email, password);
            if (!message) {
                res.status(404).json({ message: "Error Signing Up" });
                return;
            }
            res.json({
                message
            });
        } catch (error) {
            next(error);
            // res.status(400).json({ message: "Error Signing Up" });
        }

    }
);

// Sign-In Route
router.post(
    "/signin",
    [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return
            }

            let { email, password } = req.body;
            email = sanitizeInput(email);


            const token = await AuthService.login(email, password);
            if (!token) {
                res.status(404).json({ message: "Error loging in" });
                return;
            }
            res.json({
                message: "Login successfully",
                token
            });
        } catch (error) {
            next(error);
            // res.status(401).json({ message: "Invalid credentials" });
        }


    }
);

export default router;
