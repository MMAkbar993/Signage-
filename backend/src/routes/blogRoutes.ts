import { Router } from 'express';
import { validate, body, param } from '../middleware/validate';
import { authenticate, requireAdmin } from '../middleware/auth';
import blogController from '../controllers/blogController';

const router = Router();

/**
 * Public blog routes
 */

/**
 * @route GET /api/blog
 * @desc Get all published blog posts
 * @access Public
 */
router.get('/', blogController.getAllPosts);

/**
 * @route GET /api/blog/categories
 * @desc Get blog categories
 * @access Public
 */
router.get('/categories', blogController.getCategories);

/**
 * @route GET /api/blog/popular
 * @desc Get popular posts
 * @access Public
 */
router.get('/popular', blogController.getPopularPosts);

/**
 * @route GET /api/blog/:slug
 * @desc Get a blog post by slug
 * @access Public
 */
router.get(
  '/:slug',
  validate([
    param('slug')
      .trim()
      .notEmpty()
      .withMessage('Slug is required'),
  ]),
  blogController.getPostBySlug
);

/**
 * @route POST /api/blog/:slug/comments
 * @desc Add a comment to a post
 * @access Public
 */
router.post(
  '/:slug/comments',
  validate([
    param('slug').trim().notEmpty(),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 100 }),
    body('email')
      .isEmail()
      .withMessage('Valid email is required'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Comment content is required')
      .isLength({ max: 2000 }),
  ]),
  blogController.addComment
);

/**
 * Admin blog routes
 */

/**
 * @route GET /api/blog/admin/posts
 * @desc Get all posts (including drafts) - Admin
 * @access Private (Admin)
 */
router.get('/admin/posts', authenticate, requireAdmin, blogController.adminGetAllPosts);

/**
 * @route POST /api/blog/admin/posts
 * @desc Create a blog post - Admin
 * @access Private (Admin)
 */
router.post(
  '/admin/posts',
  authenticate,
  requireAdmin,
  validate([
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 255 }),
    body('slug')
      .trim()
      .notEmpty()
      .withMessage('Slug is required')
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Slug must be lowercase with hyphens only'),
    body('content')
      .notEmpty()
      .withMessage('Content is required'),
    body('category')
      .isIn(['safety_tips', 'industry_news', 'tutorials', 'case_studies', 'regulations', 'best_practices'])
      .withMessage('Invalid category'),
    body('excerpt').optional().trim(),
    body('coverImage').optional(),
    body('tags').optional().isArray(),
    body('isPublished').optional().isBoolean(),
  ]),
  blogController.createPost
);

/**
 * @route PUT /api/blog/admin/posts/:id
 * @desc Update a blog post - Admin
 * @access Private (Admin)
 */
router.put(
  '/admin/posts/:id',
  authenticate,
  requireAdmin,
  validate([
    param('id').isUUID().withMessage('Invalid post ID'),
    body('title').optional().trim().isLength({ max: 255 }),
    body('slug').optional().matches(/^[a-z0-9-]+$/),
  ]),
  blogController.updatePost
);

/**
 * @route DELETE /api/blog/admin/posts/:id
 * @desc Delete a blog post - Admin
 * @access Private (Admin)
 */
router.delete(
  '/admin/posts/:id',
  authenticate,
  requireAdmin,
  validate([param('id').isUUID().withMessage('Invalid post ID')]),
  blogController.deletePost
);

/**
 * @route PUT /api/blog/admin/comments/:id
 * @desc Moderate a comment - Admin
 * @access Private (Admin)
 */
router.put(
  '/admin/comments/:id',
  authenticate,
  requireAdmin,
  validate([
    param('id').isUUID().withMessage('Invalid comment ID'),
    body('isApproved').isBoolean().withMessage('isApproved is required'),
  ]),
  blogController.moderateComment
);

/**
 * @route DELETE /api/blog/admin/comments/:id
 * @desc Delete a comment - Admin
 * @access Private (Admin)
 */
router.delete(
  '/admin/comments/:id',
  authenticate,
  requireAdmin,
  validate([param('id').isUUID().withMessage('Invalid comment ID')]),
  blogController.deleteComment
);

export default router;
