/**
 * Error tipado de la aplicación.
 * Permite que el middleware global mapee el status HTTP de forma consistente.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'El registro ya existe') {
    super(message, 409);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  public readonly details?: unknown;
  constructor(message = 'Error de validación', details?: unknown) {
    super(message, 400);
    this.details = details;
  }
}
