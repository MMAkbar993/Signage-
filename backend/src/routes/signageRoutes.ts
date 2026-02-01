import { Router } from 'express';
import { validate, body, param } from '../middleware/validate';
import { authenticate, optionalAuth } from '../middleware/auth';
import signageController from '../controllers/signageController';

const router = Router();

/**
 * @route GET /api/signages/public
 * @desc Get public signages
 * @access Public
 */
router.get('/public', signageController.getPublicSignages);

/**
 * @route GET /api/signages
 * @desc Get all signages for current user
 * @access Private
 */
router.get('/', authenticate, signageController.getAllSignages);

/**
 * @route GET /api/signages/:id
 * @desc Get a single signage
 * @access Private
 */
router.get(
  '/:id',
  authenticate,
  validate([param('id').isUUID().withMessage('Invalid signage ID')]),
  signageController.getSignage
);

/**
 * @route POST /api/signages
 * @desc Create a new signage
 * @access Private
 */
router.post(
  '/',
  authenticate,
  validate([
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 255 })
      .withMessage('Title must be less than 255 characters'),
    body('category')
      .isIn([
        'danger', 'warning', 'caution', 'mandatory', 'prohibition',
        'emergency', 'fire', 'chemical', 'electrical', 'stp',
        'traffic', 'informational', 'custom'
      ])
      .withMessage('Invalid category'),
    body('description').optional().trim(),
    body('purpose').optional().trim(),
    body('location').optional().trim(),
    body('hazards').optional().isArray(),
    body('ppe').optional().isArray(),
    body('procedures').optional().isArray(),
    body('size').optional().isIn(['a3', 'a4', 'custom']),
    body('resolution').optional().isIn(['72dpi', '300dpi']),
    body('isPublic').optional().isBoolean(),
  ]),
  signageController.createSignage
);

/**
 * @route PUT /api/signages/:id
 * @desc Update a signage
 * @access Private
 */
router.put(
  '/:id',
  authenticate,
  validate([
    param('id').isUUID().withMessage('Invalid signage ID'),
    body('title').optional().trim().isLength({ max: 255 }),
    body('category').optional().isIn([
      'danger', 'warning', 'caution', 'mandatory', 'prohibition',
      'emergency', 'fire', 'chemical', 'electrical', 'stp',
      'traffic', 'informational', 'custom'
    ]),
  ]),
  signageController.updateSignage
);

/**
 * @route DELETE /api/signages/:id
 * @desc Delete a signage
 * @access Private
 */
router.delete(
  '/:id',
  authenticate,
  validate([param('id').isUUID().withMessage('Invalid signage ID')]),
  signageController.deleteSignage
);

/**
 * @route POST /api/signages/:id/duplicate
 * @desc Duplicate a signage
 * @access Private
 */
router.post(
  '/:id/duplicate',
  authenticate,
  validate([param('id').isUUID().withMessage('Invalid signage ID')]),
  signageController.duplicateSignage
);

/**
 * @route POST /api/signages/:id/download
 * @desc Track signage download
 * @access Public (with optional auth)
 */
router.post(
  '/:id/download',
  optionalAuth,
  validate([
    param('id').isUUID().withMessage('Invalid signage ID'),
    body('format').optional().isString(),
  ]),
  signageController.trackDownload
);

export default router;
