import { Router } from 'express';
import { validate, body, param } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import templateController from '../controllers/templateController';

const router = Router();

/**
 * Public template routes
 */

/**
 * @route GET /api/templates
 * @desc Get all templates
 * @access Public
 */
router.get('/', templateController.getAllTemplates);

/**
 * @route GET /api/templates/categories
 * @desc Get template categories
 * @access Public
 */
router.get('/categories', templateController.getCategories);

/**
 * @route GET /api/templates/industries
 * @desc Get template industries
 * @access Public
 */
router.get('/industries', templateController.getIndustries);

/**
 * @route GET /api/templates/popular
 * @desc Get popular templates
 * @access Public
 */
router.get('/popular', templateController.getPopularTemplates);

/**
 * @route GET /api/templates/:id
 * @desc Get a single template
 * @access Public
 */
router.get(
  '/:id',
  validate([param('id').notEmpty().withMessage('Invalid template ID')]),
  templateController.getTemplate
);

/**
 * Custom/User template routes
 */

/**
 * @route GET /api/templates/user/my-templates
 * @desc Get user's custom templates
 * @access Private
 */
router.get('/user/my-templates', authenticate, templateController.getUserTemplates);

/**
 * @route GET /api/templates/user/:id
 * @desc Get a user's custom template
 * @access Private
 */
router.get(
  '/user/:id',
  authenticate,
  validate([param('id').isUUID().withMessage('Invalid template ID')]),
  templateController.getUserTemplate
);

/**
 * @route POST /api/templates/user
 * @desc Create a custom template
 * @access Private
 */
router.post(
  '/user',
  authenticate,
  validate([
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 255 }),
    body('category')
      .isIn([
        'danger', 'warning', 'caution', 'mandatory', 'prohibition',
        'emergency', 'fire', 'chemical', 'electrical', 'stp',
        'traffic', 'informational', 'custom'
      ])
      .withMessage('Invalid category'),
    body('data')
      .notEmpty()
      .withMessage('Template data is required'),
    body('description').optional().trim(),
    body('thumbnail').optional(),
    body('isPublic').optional().isBoolean(),
  ]),
  templateController.createUserTemplate
);

/**
 * @route PUT /api/templates/user/:id
 * @desc Update a custom template
 * @access Private
 */
router.put(
  '/user/:id',
  authenticate,
  validate([
    param('id').isUUID().withMessage('Invalid template ID'),
    body('name').optional().trim().isLength({ max: 255 }),
  ]),
  templateController.updateUserTemplate
);

/**
 * @route DELETE /api/templates/user/:id
 * @desc Delete a custom template
 * @access Private
 */
router.delete(
  '/user/:id',
  authenticate,
  validate([param('id').isUUID().withMessage('Invalid template ID')]),
  templateController.deleteUserTemplate
);

export default router;
