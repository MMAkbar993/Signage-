import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, body, param, query } from 'express-validator';
import { ValidationError } from '../utils/errors';

/**
 * Middleware to run validation chains and handle errors
 */
export function validate(validations: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const formattedErrors: Record<string, string[]> = {};
      
      errors.array().forEach(error => {
        if (error.type === 'field') {
          const field = error.path;
          if (!formattedErrors[field]) {
            formattedErrors[field] = [];
          }
          formattedErrors[field].push(error.msg);
        }
      });

      return next(new ValidationError('Validation failed', formattedErrors));
    }

    next();
  };
}

// =====================
// Common Validators
// =====================

export const commonValidators = {
  // Pagination
  page: query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  // UUID
  uuid: (field: string) =>
    param(field)
      .isUUID()
      .withMessage(`${field} must be a valid UUID`),

  // Email
  email: body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  // Password
  password: body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  strongPassword: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),

  // String fields
  requiredString: (field: string, minLength = 1, maxLength = 255) =>
    body(field)
      .trim()
      .notEmpty()
      .withMessage(`${field} is required`)
      .isLength({ min: minLength, max: maxLength })
      .withMessage(`${field} must be between ${minLength} and ${maxLength} characters`),

  optionalString: (field: string, maxLength = 255) =>
    body(field)
      .optional()
      .trim()
      .isLength({ max: maxLength })
      .withMessage(`${field} must be less than ${maxLength} characters`),

  // Boolean
  optionalBoolean: (field: string) =>
    body(field)
      .optional()
      .isBoolean()
      .withMessage(`${field} must be a boolean`)
      .toBoolean(),

  // Array
  optionalArray: (field: string) =>
    body(field)
      .optional()
      .isArray()
      .withMessage(`${field} must be an array`),

  // Enum
  enum: (field: string, values: string[]) =>
    body(field)
      .isIn(values)
      .withMessage(`${field} must be one of: ${values.join(', ')}`),

  optionalEnum: (field: string, values: string[]) =>
    body(field)
      .optional()
      .isIn(values)
      .withMessage(`${field} must be one of: ${values.join(', ')}`),
};

export { body, param, query };

export default {
  validate,
  commonValidators,
  body,
  param,
  query,
};
