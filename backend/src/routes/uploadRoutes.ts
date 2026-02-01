import { Router } from 'express';
import { validate, param } from '../middleware/validate';
import { authenticate, optionalAuth } from '../middleware/auth';
import { upload, uploadImage as uploadImageMiddleware, uploadToMemory } from '../middleware/upload';
import uploadController from '../controllers/uploadController';

const router = Router();

/**
 * @route POST /api/uploads/file
 * @desc Upload a single file
 * @access Private
 */
router.post(
  '/file',
  authenticate,
  upload.single('file'),
  uploadController.uploadFile
);

/**
 * @route POST /api/uploads/files
 * @desc Upload multiple files
 * @access Private
 */
router.post(
  '/files',
  authenticate,
  upload.array('files', 10),
  uploadController.uploadFiles
);

/**
 * @route POST /api/uploads/image
 * @desc Upload and process an image
 * @access Private
 */
router.post(
  '/image',
  authenticate,
  uploadImageMiddleware.single('image'),
  uploadController.uploadImage
);

/**
 * @route POST /api/uploads/image/base64
 * @desc Upload image and convert to base64
 * @access Private (or optional auth for public usage)
 */
router.post(
  '/image/base64',
  optionalAuth,
  uploadToMemory.single('image'),
  uploadController.imageToBase64
);

/**
 * @route GET /api/uploads
 * @desc Get user's uploads
 * @access Private
 */
router.get('/', authenticate, uploadController.getUserUploads);

/**
 * @route DELETE /api/uploads/:id
 * @desc Delete an upload
 * @access Private
 */
router.delete(
  '/:id',
  authenticate,
  validate([param('id').isUUID().withMessage('Invalid upload ID')]),
  uploadController.deleteUpload
);

export default router;
