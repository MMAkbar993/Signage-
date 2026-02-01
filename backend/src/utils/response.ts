import { Response } from 'express';

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Send success response
 */
export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200,
  meta?: ApiResponse['meta']
): Response {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta,
  };
  return res.status(statusCode).json(response);
}

/**
 * Send created response
 */
export function sendCreated<T>(res: Response, data?: T, message: string = 'Created successfully'): Response {
  return sendSuccess(res, data, message, 201);
}

/**
 * Send no content response
 */
export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

/**
 * Send error response
 */
export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): Response {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
  return res.status(statusCode).json(response);
}

/**
 * Send paginated response
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): Response {
  const totalPages = Math.ceil(total / limit);
  return sendSuccess(res, data, message, 200, {
    page,
    limit,
    total,
    totalPages,
  });
}

export default {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendError,
  sendPaginated,
};
