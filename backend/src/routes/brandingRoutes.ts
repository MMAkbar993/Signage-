import { Router } from 'express';
import { validate, body, param } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { uploadToMemory } from '../middleware/upload';
import brandingController from '../controllers/brandingController';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/branding
 * @desc Get company branding
 * @access Private
 */
router.get('/', brandingController.getBranding);

/**
 * @route PUT /api/branding
 * @desc Update company branding
 * @access Private
 */
router.put(
  '/',
  validate([
    body('companyName').optional().trim().isLength({ max: 255 }),
    body('contactInfo').optional().trim().isLength({ max: 1000 }),
    body('clientLogo').optional(),
    body('contractorLogo').optional(),
  ]),
  brandingController.updateBranding
);

/**
 * @route DELETE /api/branding
 * @desc Delete company branding
 * @access Private
 */
router.delete('/', brandingController.deleteBranding);

/**
 * @route POST /api/branding/logo/:type
 * @desc Upload a logo (client or contractor)
 * @access Private
 */
router.post(
  '/logo/:type',
  validate([
    param('type')
      .isIn(['client', 'contractor'])
      .withMessage('Type must be client or contractor'),
  ]),
  uploadToMemory.single('logo'),
  brandingController.uploadLogo
);

export default router;
