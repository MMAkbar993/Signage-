import { Router } from 'express';
import { validate, body, param } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import organizationChartController from '../controllers/organizationChartController';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/organization-charts
 * @desc Get all organization charts
 * @access Private
 */
router.get('/', organizationChartController.getAllOrganizationCharts);

/**
 * @route GET /api/organization-charts/:id
 * @desc Get a single organization chart
 * @access Private
 */
router.get(
  '/:id',
  validate([param('id').isUUID().withMessage('Invalid ID')]),
  organizationChartController.getOrganizationChart
);

/**
 * @route POST /api/organization-charts
 * @desc Create an organization chart
 * @access Private
 */
router.post(
  '/',
  validate([
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 255 }),
    body('description').optional().trim(),
    body('chartData')
      .notEmpty()
      .withMessage('Chart data is required'),
    body('style').optional(),
    body('isActive').optional().isBoolean(),
  ]),
  organizationChartController.createOrganizationChart
);

/**
 * @route PUT /api/organization-charts/:id
 * @desc Update an organization chart
 * @access Private
 */
router.put(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid ID'),
    body('name').optional().trim().isLength({ max: 255 }),
  ]),
  organizationChartController.updateOrganizationChart
);

/**
 * @route DELETE /api/organization-charts/:id
 * @desc Delete an organization chart
 * @access Private
 */
router.delete(
  '/:id',
  validate([param('id').isUUID().withMessage('Invalid ID')]),
  organizationChartController.deleteOrganizationChart
);

/**
 * @route POST /api/organization-charts/:id/duplicate
 * @desc Duplicate an organization chart
 * @access Private
 */
router.post(
  '/:id/duplicate',
  validate([param('id').isUUID().withMessage('Invalid ID')]),
  organizationChartController.duplicateOrganizationChart
);

export default router;
