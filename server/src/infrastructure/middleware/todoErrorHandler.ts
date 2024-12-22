import { CustomError } from "./errorHandler";



export enum TodoErrorCode {
    INVALID_STATUS_VALUE = 'INVALID_STATUS_VALUE',
    TODO_NOT_FOUND = 'TODO_NOT_FOUND',
    INVALID_DATE_VALUE = 'INVALID_DATE_VALUE'
}

export class TodoError extends CustomError {
    constructor(
        message: string, 
        code: TodoErrorCode = TodoErrorCode.TODO_NOT_FOUND,
        status: number = 401
    ) {
        super(message, status, code);
        this.name = 'TodoError';
    }
}