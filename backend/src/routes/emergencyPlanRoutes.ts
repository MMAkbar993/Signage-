import { Router } from 'express';
import { validate, body, param } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import emergencyPlanController from '../controllers/emergencyPlanController';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/emergency-plans
 * @desc Get all emergency plans
 * @access Private
 */
router.get('/', emergencyPlanController.getAllEmergencyPlans);

/**
 * @route GET /api/emergency-plans/types
 * @desc Get distinct emergency types
 * @access Private
 */
router.get('/types', emergencyPlanController.getEmergencyTypes);

/**
 * @route GET /api/emergency-plans/:id
 * @desc Get a single emergency plan
 * @access Private
 */
router.get(
  '/:id',
  validate([param('id').isUUID().withMessage('Invalid ID')]),
  emergencyPlanController.getEmergencyPlan
);

/**
 * @route POST /api/emergency-plans
 * @desc Create an emergency plan
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
    body('location').optional().trim(),
    body('description').optional().trim(),
    body('emergencyType').optional().trim(),
    body('assemblyPoints').optional().isArray(),
    body('evacuationRoutes').optional(),
    body('emergencyContacts').optional(),
    body('teamMembers').optional(),
    body('procedures').optional().isArray(),
    body('equipment').optional().isArray(),
    body('isActive').optional().isBoolean(),
  ]),
  emergencyPlanController.createEmergencyPlan
);

/**
 * @route PUT /api/emergency-plans/:id
 * @desc Update an emergency plan
 * @access Private
 */
router.put(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid ID'),
    body('name').optional().trim().isLength({ max: 255 }),
  ]),
  emergencyPlanController.updateEmergencyPlan
);

/**
 * @route DELETE /api/emergency-plans/:id
 * @desc Delete an emergency plan
 * @access Private
 */
router.delete(
  '/:id',
  validate([param('id').isUUID().withMessage('Invalid ID')]),
  emergencyPlanController.deleteEmergencyPlan
);

/**
 * @route POST /api/emergency-plans/:id/duplicate
 * @desc Duplicate an emergency plan
 * @access Private
 */
router.post(
  '/:id/duplicate',
  validate([param('id').isUUID().withMessage('Invalid ID')]),
  emergencyPlanController.duplicateEmergencyPlan
);

export default router;
