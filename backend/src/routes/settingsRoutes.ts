import { Router } from 'express';
import { validate, body } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import settingsController from '../controllers/settingsController';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/settings
 * @desc Get user settings
 * @access Private
 */
router.get('/', settingsController.getSettings);

/**
 * @route PUT /api/settings
 * @desc Update user settings
 * @access Private
 */
router.put(
  '/',
  validate([
    body('defaultPaperSize')
      .optional()
      .isIn(['a3', 'a4', 'letter', 'legal'])
      .withMessage('Invalid paper size'),
    body('defaultOrientation')
      .optional()
      .isIn(['landscape', 'portrait'])
      .withMessage('Invalid orientation'),
    body('defaultResolution')
      .optional()
      .isIn(['72dpi', '300dpi'])
      .withMessage('Invalid resolution'),
    body('autoFitToPage').optional().isBoolean(),
    body('printBackgrounds').optional().isBoolean(),
    body('language').optional().isLength({ min: 2, max: 5 }),
  ]),
  settingsController.updateSettings
);

/**
 * @route POST /api/settings/reset
 * @desc Reset settings to defaults
 * @access Private
 */
router.post('/reset', settingsController.resetSettings);

export default router;
