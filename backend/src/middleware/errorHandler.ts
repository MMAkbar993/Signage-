import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { Prisma } from '@prisma/client';

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle known errors
  if (err instanceof AppError) {
    if (err instanceof ValidationError) {
      sendError(res, err.message, err.statusCode, err.code, err.errors);
      return;
    }
    sendError(res, err.message, err.statusCode, err.code);
    return;
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    handlePrismaError(err, res);
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError(res, 'Invalid data provided', 400, 'VALIDATION_ERROR');
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401, 'INVALID_TOKEN');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 401, 'TOKEN_EXPIRED');
    return;
  }

  // Handle multer errors
  if (err.name === 'MulterError') {
    handleMulterError(err as any, res);
    return;
  }

  // Handle syntax errors (e.g., invalid JSON)
  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 'Invalid JSON', 400, 'INVALID_JSON');
    return;
  }

  // Unknown error - don't expose internal details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : err.message;

  sendError(res, message, 500, 'INTERNAL_ERROR');
}

/**
 * Handle Prisma-specific errors
 */
function handlePrismaError(err: Prisma.PrismaClientKnownRequestError, res: Response): void {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const field = (err.meta?.target as string[])?.join(', ') || 'field';
      sendError(res, `A record with this ${field} already exists`, 409, 'DUPLICATE_ENTRY');
      break;
    
    case 'P2025':
      // Record not found
      sendError(res, 'Record not found', 404, 'NOT_FOUND');
      break;
    
    case 'P2003':
      // Foreign key constraint violation
      sendError(res, 'Related record not found', 400, 'FOREIGN_KEY_ERROR');
      break;
    
    case 'P2014':
      // Required relation violation
      sendError(res, 'Required relation data is missing', 400, 'RELATION_ERROR');
      break;

    default:
      sendError(res, 'Database error', 500, 'DATABASE_ERROR');
  }
}

/**
 * Handle Multer file upload errors
 */
function handleMulterError(err: { code: string }, res: Response): void {
  switch (err.code) {
    case 'LIMIT_FILE_SIZE':
      sendError(res, 'File too large', 400, 'FILE_TOO_LARGE');
      break;
    
    case 'LIMIT_FILE_COUNT':
      sendError(res, 'Too many files', 400, 'TOO_MANY_FILES');
      break;
    
    case 'LIMIT_UNEXPECTED_FILE':
      sendError(res, 'Unexpected file field', 400, 'UNEXPECTED_FILE');
      break;

    default:
      sendError(res, 'File upload error', 400, 'UPLOAD_ERROR');
  }
}

/**
 * 404 handler for unknown routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Route ${req.method} ${req.path} not found`, 404, 'ROUTE_NOT_FOUND');
}

export default {
  errorHandler,
  notFoundHandler,
};
