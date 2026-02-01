import { Router } from 'express';
import { validate, body, param } from '../middleware/validate';
import { authenticate, requireAdmin, requireSuperAdmin } from '../middleware/auth';
import adminController from '../controllers/adminController';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

/**
 * @route GET /api/admin/dashboard
 * @desc Get dashboard statistics
 * @access Private (Admin)
 */
router.get('/dashboard', adminController.getDashboardStats);

/**
 * @route GET /api/admin/users
 * @desc Get all users
 * @access Private (Admin)
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route GET /api/admin/users/:id
 * @desc Get a single user
 * @access Private (Admin)
 */
router.get(
  '/users/:id',
  validate([param('id').isUUID().withMessage('Invalid user ID')]),
  adminController.getUser
);

/**
 * @route PUT /api/admin/users/:id
 * @desc Update a user
 * @access Private (Admin)
 */
router.put(
  '/users/:id',
  validate([
    param('id').isUUID().withMessage('Invalid user ID'),
    body('firstName').optional().trim().isLength({ max: 50 }),
    body('lastName').optional().trim().isLength({ max: 50 }),
    body('role').optional().isIn(['USER', 'ADMIN', 'SUPER_ADMIN']),
    body('isActive').optional().isBoolean(),
  ]),
  adminController.updateUser
);

/**
 * @route POST /api/admin/users/:id/reset-password
 * @desc Reset user password
 * @access Private (Admin)
 */
router.post(
  '/users/:id/reset-password',
  validate([
    param('id').isUUID().withMessage('Invalid user ID'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ]),
  adminController.resetUserPassword
);

/**
 * @route DELETE /api/admin/users/:id
 * @desc Delete a user
 * @access Private (Super Admin)
 */
router.delete(
  '/users/:id',
  requireSuperAdmin,
  validate([param('id').isUUID().withMessage('Invalid user ID')]),
  adminController.deleteUser
);

/**
 * @route GET /api/admin/history
 * @desc Get signage history
 * @access Private (Admin)
 */
router.get('/history', adminController.getSignageHistory);

/**
 * Template management (Super Admin)
 */

/**
 * @route POST /api/admin/templates
 * @desc Create a template
 * @access Private (Super Admin)
 */
router.post(
  '/templates',
  requireSuperAdmin,
  validate([
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),
    body('category')
      .isIn([
        'danger', 'warning', 'caution', 'mandatory', 'prohibition',
        'emergency', 'fire', 'chemical', 'electrical', 'stp',
        'traffic', 'informational', 'custom'
      ])
      .withMessage('Invalid category'),
    body('description').optional().trim(),
    body('hazards').optional().isArray(),
    body('safetyProcedures').optional().isArray(),
    body('requiredPPE').optional().isArray(),
    body('tags').optional().isArray(),
  ]),
  adminController.createTemplate
);

/**
 * @route PUT /api/admin/templates/:id
 * @desc Update a template
 * @access Private (Super Admin)
 */
router.put(
  '/templates/:id',
  requireSuperAdmin,
  validate([param('id').notEmpty().withMessage('Invalid template ID')]),
  adminController.updateTemplate
);

/**
 * @route DELETE /api/admin/templates/:id
 * @desc Delete a template
 * @access Private (Super Admin)
 */
router.delete(
  '/templates/:id',
  requireSuperAdmin,
  validate([param('id').notEmpty().withMessage('Invalid template ID')]),
  adminController.deleteTemplate
);

export default router;
