import { User } from "../../domain/Auth";
import fs from "fs";
import path from "path";

const AUTH_DB = path.join(__dirname, "../storage/auth.json");
// Custom error classes for better error handling
export class AuthStorageError extends Error {
    constructor(message: string, public readonly cause?: Error) {
        super(message);
        this.name = 'AuthStorageError';
    }
}

export class AuthRepo {
    private static readonly STORAGE_DIR = path.join(__dirname, "../storage");
    private static readonly AUTH_DB = path.join(AuthRepo.STORAGE_DIR, "auth.json");

    /**
     * Initialize the storage directory and database file
     */
    private static initializeStorage(): void {
        try {
            // Create storage directory if it doesn't exist
            if (!fs.existsSync(AuthRepo.STORAGE_DIR)) {
                fs.mkdirSync(AuthRepo.STORAGE_DIR, { recursive: true });
            }

            // Create auth.json if it doesn't exist
            if (!fs.existsSync(AuthRepo.AUTH_DB)) {
                fs.writeFileSync(AuthRepo.AUTH_DB, "[]", "utf-8");
            }
        } catch (error) {
            throw new AuthStorageError(
                "Failed to initialize storage",
                error instanceof Error ? error : undefined
            );
        }
    }


     /**
     * Read todos from the JSON file
     */
     private static readData(): User[] {
        try {
            AuthRepo.initializeStorage();
            const data = fs.readFileSync(AuthRepo.AUTH_DB, "utf-8");
            const auth = JSON.parse(data) as User[];
            
            // Validate the data structure
            if (!Array.isArray(auth)) {
                throw new Error("Invalid data structure in storage");
            }
            
            return auth;
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new AuthStorageError("Invalid JSON in storage file");
            }
            throw new AuthStorageError(
                "Failed to read Auth",
                error instanceof Error ? error : undefined
            );
        }
    }

     /**
     * Write todos to the JSON file
     */
     private static writeData(users: User[]): void {
        try {
            AuthRepo.initializeStorage();
            fs.writeFileSync(
                AuthRepo.AUTH_DB,
                JSON.stringify(users, null, 2),
                "utf-8"
            );
        } catch (error) {
            throw new AuthStorageError(
                "Failed to write users",
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Get user by email
    */
    static async getByEmail(email: string): Promise<User | null>{
        try {
            const users = AuthRepo.readData();
            return users.find(user => user.email === email) || null;
        } catch (error) {
            console.log(error, "error")
            throw new AuthStorageError(
                "Failed to get user",
                error instanceof Error ? error : undefined
            );
        }
    }


    /**
     * Create a new user
    */
    static async create(user: User): Promise<User> {
        try {
            const users = AuthRepo.readData();
            // Check for duplicate ID
            if (users.some(t => t.id === user.id)) {
                throw new AuthStorageError(`Auth with ID already exists`);
            }
            users.push(user);
            AuthRepo.writeData(users);
            return user;
        } catch (error) {
            if (error instanceof AuthStorageError) throw error;
            throw new AuthStorageError(
                "Failed to create user",
                error instanceof Error ? error : undefined
            );
        }
    }
}
