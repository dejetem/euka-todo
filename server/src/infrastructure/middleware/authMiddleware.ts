import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "secret";


export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access denied" });
        return;
      }
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { id: string; email: string };
      req.user = { id: decoded.id, email: decoded.email };
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
  
