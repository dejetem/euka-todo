import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { AuthRepo } from "../infrastructure/repositories/authRepo";
import { User } from "../domain/Auth";
import { AuthError, AuthErrorCode } from "../infrastructure/middleware/authErrorHandler";



const SECRET_KEY = process.env.JWT_SECRET || "secret";


export class AuthService {
  // Register a new user
  static async register(email: string, password: string): Promise<string> {
    // Check if user already exists
    const existingUser =  await AuthRepo.getByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser: User = {
      id: uuid(),
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save user to database
    await AuthRepo.create(newUser);

    return "User registered successfully";
  }

  // Login an existing user
  static async login(email: string, password: string): Promise<string> {
    // Find user by email
    const user =  await AuthRepo.getByEmail(email);
    if (!user) {
        throw new AuthError(
            'Invalid credentials',
            AuthErrorCode.USER_NOT_FOUND
        );
    }

    // Compare the passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AuthError(
            'Invalid credentials',
            AuthErrorCode.INVALID_CREDENTIALS
        );
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return token;
  }
}
