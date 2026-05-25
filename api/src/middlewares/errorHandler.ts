import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Middleware global de errores.
 * Convierte cualquier error en una respuesta JSON consistente.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(('details' in err) && (err as AppError & { details?: unknown }).details
        ? { details: (err as AppError & { details?: unknown }).details }
        : {}),
    });
    return;
  }

  // eslint-disable-next-line no-console
  console.error('[UNEXPECTED ERROR]', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
  });
};
