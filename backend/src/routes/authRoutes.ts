import { Router } from 'express';
import { validate, body } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import authController from '../controllers/authController';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  validate([
    body('email')
      .isEmail()
      .withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('First name must be less than 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Last name must be less than 50 characters'),
    body('username')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ min: 3, max: 30 })
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username: 3-30 chars, letters, numbers, underscore, hyphen'),
  ]),
  authController.register
);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  '/login',
  validate([
    body('email')
      .isEmail()
      .withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ]),
  authController.login
);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post(
  '/refresh',
  validate([
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ]),
  authController.refreshToken
);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private (optional)
 */
router.post('/logout', authController.logout);

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', authenticate, authController.me);

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put(
  '/profile',
  authenticate,
  validate([
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 50 }),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 50 }),
    body('username')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ min: 3, max: 30 })
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username: 3-30 chars, letters, numbers, underscore, hyphen'),
    body('avatar')
      .optional(),
  ]),
  authController.updateProfile
);

/**
 * @route GET /api/auth/users/search
 * @desc Search users by username (for chat/friends)
 * @access Private
 */
router.get('/users/search', authenticate, authController.searchUsers);

/**
 * @route PUT /api/auth/password
 * @desc Change password
 * @access Private
 */
router.put(
  '/password',
  authenticate,
  validate([
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ]),
  authController.changePassword
);

export default router;
