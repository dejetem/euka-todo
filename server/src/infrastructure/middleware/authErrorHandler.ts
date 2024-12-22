import { CustomError } from "./errorHandler";



export enum AuthErrorCode {
    INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
    TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
    INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
    USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND'
}

export class AuthError extends CustomError {
    constructor(
        message: string, 
        code: AuthErrorCode = AuthErrorCode.INVALID_CREDENTIALS,
        status: number = 401
    ) {
        super(message, status, code);
        this.name = 'AuthError';
    }
}