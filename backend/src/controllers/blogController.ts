import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { getParam } from '../utils/request';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { BlogCategory, UserRole } from '@prisma/client';

/**
 * Get all published blog posts (public)
 */
export async function getAllPosts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const category = getParam(req, 'category');
    const search = getParam(req, 'search');
    const tags = getParam(req, 'tags');

    const where: Record<string, unknown> = {
      isPublished: true,
    };

    if (category) {
      where.category = category as BlogCategory;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      where.tags = { hasSome: tagArray };
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          category: true,
          tags: true,
          publishedAt: true,
          viewCount: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    sendPaginated(res, posts, page, limit, total);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single blog post by slug (public)
 */
export async function getPostBySlug(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const slug = getParam(req, 'slug')!;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        comments: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post || !post.isPublished) {
      throw new NotFoundError('Blog post not found');
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    sendSuccess(res, post);
  } catch (error) {
    next(error);
  }
}

/**
 * Get blog categories with post counts
 */
export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await prisma.blogPost.groupBy({
      by: ['category'],
      _count: { category: true },
      where: { isPublished: true },
    });

    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
}

/**
 * Get popular posts
 */
export async function getPopularPosts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { viewCount: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        viewCount: true,
        publishedAt: true,
      },
    });

    sendSuccess(res, posts);
  } catch (error) {
    next(error);
  }
}

/**
 * Add a comment to a post
 */
export async function addComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const slug = getParam(req, 'slug')!;
    const { name, email, content } = req.body;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true, isPublished: true },
    });

    if (!post || !post.isPublished) {
      throw new NotFoundError('Blog post not found');
    }

    const comment = await prisma.blogComment.create({
      data: {
        postId: post.id,
        name,
        email,
        content,
        isApproved: false, // Requires moderation
      },
    });

    sendCreated(res, comment, 'Comment submitted for moderation');
  } catch (error) {
    next(error);
  }
}

// =====================
// Admin Blog Management
// =====================

/**
 * Get all posts (admin - includes drafts)
 */
export async function adminGetAllPosts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const isPublished = getParam(req, 'isPublished');
    const search = getParam(req, 'search');

    const where: Record<string, unknown> = {};

    // Non-super admins can only see their own posts
    if (req.user!.role !== UserRole.SUPER_ADMIN) {
      where.userId = req.user!.id;
    }

    if (isPublished !== undefined) {
      where.isPublished = isPublished === 'true';
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { firstName: true, lastName: true },
          },
          _count: {
            select: { comments: true },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    sendPaginated(res, posts, page, limit, total);
  } catch (error) {
    next(error);
  }
}

/**
 * Create a blog post (admin)
 */
export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, slug, excerpt, content, coverImage, category, tags, isPublished } = req.body;

    const post = await prisma.blogPost.create({
      data: {
        userId: req.user!.id,
        title,
        slug,
        excerpt,
        content,
        coverImage,
        category,
        tags,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    sendCreated(res, post, 'Blog post created successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update a blog post (admin)
 */
export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    const existing = await prisma.blogPost.findUnique({
      where: { id },
      select: { userId: true, isPublished: true },
    });

    if (!existing) {
      throw new NotFoundError('Blog post not found');
    }

    // Check permission
    if (existing.userId !== req.user!.id && req.user!.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenError('You do not have permission to update this post');
    }

    const { isPublished, ...data } = req.body;

    // Set publishedAt when publishing for first time
    if (isPublished && !existing.isPublished) {
      data.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        isPublished,
      },
    });

    sendSuccess(res, post, 'Blog post updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a blog post (admin)
 */
export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    const existing = await prisma.blogPost.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new NotFoundError('Blog post not found');
    }

    if (existing.userId !== req.user!.id && req.user!.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenError('You do not have permission to delete this post');
    }

    await prisma.blogPost.delete({ where: { id } });

    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

/**
 * Moderate comment (admin)
 */
export async function moderateComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;
    const { isApproved } = req.body;

    const comment = await prisma.blogComment.update({
      where: { id },
      data: { isApproved },
    });

    sendSuccess(res, comment, `Comment ${isApproved ? 'approved' : 'rejected'}`);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete comment (admin)
 */
export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    await prisma.blogComment.delete({ where: { id } });

    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

export default {
  getAllPosts,
  getPostBySlug,
  getCategories,
  getPopularPosts,
  addComment,
  adminGetAllPosts,
  createPost,
  updatePost,
  deletePost,
  moderateComment,
  deleteComment,
};
