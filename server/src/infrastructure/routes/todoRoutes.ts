import { Router, Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import { TodoService } from "../../application/TodoService";
import { TodoStatus, TodoUpdatePayload, Todo } from "../../domain/Todo";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Helper to sanitize inputs
const sanitizeInput = (input: string) =>
    sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });

// Create a new To-Do
router.post(
    "/",
    authenticate,
    [
        body("content").notEmpty().withMessage("Content is required"),
        body("dueDate").notEmpty().isISO8601().withMessage("Invalid due date"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            // Sanitize user input
            const content = sanitizeInput(req.body.content);
            const dueDate = sanitizeInput(req.body.dueDate);

            if (!req?.user?.id) {
                res.status(401).json({ message: "Unauthorized user" });
                return
            }

            const newTodo = await TodoService.create(content, req?.user?.id, dueDate);
            if (!newTodo) {
                res.status(404).json({ message: "Error creating todo" });
                return;
            }
            res.status(201).json({ message: "To-Do created successfully", data: newTodo });
        } catch (error) {
            next(error);
            // res.status(404).json({ message: "Error creating todo" });
        }

    }
);

// Edit an existing To-Do ot update the status
router.patch(
    "/:id",
    authenticate,
    [
        param("id").isUUID().withMessage("Invalid todo ID"),
        body("content").optional().trim().notEmpty().withMessage("Content cannot be empty"),
        body("dueDate")
            .optional()
            .isISO8601().withMessage("Invalid due date format")
            .custom(value => {
                const date = new Date(value);
                return date >= new Date();
            }).withMessage("Due date cannot be in the past"),
        body("status")
            .optional()
            .isIn(["Unfinished", "Done"]).withMessage("Invalid status"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const id = req.params.id;
            const updatePayload: TodoUpdatePayload = {};

            // Only include defined and sanitized fields
            if (req.body.content !== undefined) {
                updatePayload.content = sanitizeInput(req.body.content);
            }
            if (req.body.status !== undefined) {
                updatePayload.status = req.body.status as TodoStatus;
            }
            if (req.body.dueDate !== undefined) {
                updatePayload.dueDate = req.body.dueDate;
            }

            if (!req?.user?.id) {
                res.status(401).json({ message: "Unauthorized user" });
                return
            }

            const updatedTodo = await TodoService.update(id, updatePayload, req?.user?.id);

            // Sanitize response content
            const sanitizedTodo = {
                ...updatedTodo,
                content: sanitizeInput(updatedTodo.content)
            };

            if (!sanitizedTodo) {
                res.status(404).json({ message: "To-Do not found" });
                return;
            }

            res.json({
                message: "Todo updated successfully",
                data: sanitizedTodo
            });
        } catch (error) {
            next(error);
            // res.status(404).json({ message: "To-Do not found" });
        }

    }
);

// Get all To-Dos (Pagination included)
router.get("/", authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req?.user?.id) {
            res.status(401).json({ message: "Unauthorized user" });
            return
        }
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Math.min(Number(req.query.limit) || 10, 100));
        const { data, metadata } = await TodoService.getPaginated(page, limit, req?.user?.id);

        // Sanitize output to avoid XSS on the client side
        const sanitizedTodos = data.map(todo => ({
            ...todo,
            content: sanitizeInput(todo.content),
        }));

        if (!sanitizedTodos) {
            res.status(404).json({ message: "To-Do not found" });
            return;
        }

        res.json({
            data: sanitizedTodos,
            metadata
        });
    } catch (error) {
        next(error);
        // res.status(404).json({ message: "To-Do not found" });
    }

});

// Delete a To-Do
router.delete(
    "/:id",
    authenticate,
    [
        param("id").notEmpty().withMessage("ID is required").isUUID().withMessage("Invalid ID format"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const id = sanitizeInput(req.params.id);

            if (!req?.user?.id) {
                res.status(401).json({ message: "Unauthorized user" });
                return
            }

            const deletedTodo = await TodoService.delete(id, req?.user?.id);
            if (!deletedTodo) {
                res.status(404).json({ message: "To-Do not found" });
                return;
            }

            res.json({ message: "To-Do deleted successfully" });
        } catch (error) {
            next(error);
            // res.status(404).json({ message: "To-Do not found" });
        }

    }
);

export default router;