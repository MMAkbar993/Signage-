import { Router } from 'express';
import { validate, body, param } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import authorizedPersonController from '../controllers/authorizedPersonController';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/authorized-persons
 * @desc Get all authorized persons
 * @access Private
 */
router.get('/', authorizedPersonController.getAllAuthorizedPersons);

/**
 * @route GET /api/authorized-persons/departments
 * @desc Get distinct departments
 * @access Private
 */
router.get('/departments', authorizedPersonController.getDepartments);

/**
 * @route GET /api/authorized-persons/shifts
 * @desc Get distinct shifts
 * @access Private
 */
router.get('/shifts', authorizedPersonController.getShifts);

/**
 * @route GET /api/authorized-persons/:id
 * @desc Get a single authorized person
 * @access Private
 */
router.get(
  '/:id',
  validate([param('id').isUUID().withMessage('Invalid ID')]),
  authorizedPersonController.getAuthorizedPerson
);

/**
 * @route POST /api/authorized-persons
 * @desc Create an authorized person
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
    body('shift').optional().trim(),
    body('designation').optional().trim(),
    body('employeeId').optional().trim(),
    body('department').optional().trim(),
    body('contact').optional().trim(),
    body('certifications').optional().trim(),
    body('validFrom').optional().isISO8601(),
    body('validUntil').optional().isISO8601(),
    body('format').optional().isIn(['badge', 'paper']),
    body('category').optional().isIn([
      'danger', 'warning', 'caution', 'mandatory', 'prohibition',
      'emergency', 'fire', 'chemical', 'electrical', 'stp',
      'traffic', 'informational', 'custom'
    ]),
  ]),
  authorizedPersonController.createAuthorizedPerson
);

/**
 * @route POST /api/authorized-persons/bulk
 * @desc Bulk create authorized persons
 * @access Private
 */
router.post(
  '/bulk',
  validate([
    body('persons')
      .isArray({ min: 1 })
      .withMessage('Persons array is required'),
    body('persons.*.name')
      .trim()
      .notEmpty()
      .withMessage('Name is required for each person'),
  ]),
  authorizedPersonController.bulkCreateAuthorizedPersons
);

/**
 * @route PUT /api/authorized-persons/:id
 * @desc Update an authorized person
 * @access Private
 */
router.put(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid ID'),
    body('name').optional().trim().isLength({ max: 255 }),
  ]),
  authorizedPersonController.updateAuthorizedPerson
);

/**
 * @route DELETE /api/authorized-persons/:id
 * @desc Delete an authorized person
 * @access Private
 */
router.delete(
  '/:id',
  validate([param('id').isUUID().withMessage('Invalid ID')]),
  authorizedPersonController.deleteAuthorizedPerson
);

/**
 * @route DELETE /api/authorized-persons/bulk
 * @desc Bulk delete authorized persons
 * @access Private
 */
router.delete(
  '/bulk',
  validate([
    body('ids')
      .isArray({ min: 1 })
      .withMessage('IDs array is required'),
    body('ids.*')
      .isUUID()
      .withMessage('Each ID must be a valid UUID'),
  ]),
  authorizedPersonController.bulkDeleteAuthorizedPersons
);

export default router;
