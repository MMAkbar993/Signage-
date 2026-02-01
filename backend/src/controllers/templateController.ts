import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { SignageCategory } from '@prisma/client';

/**
 * Get all templates (public library)
 */
export async function getAllTemplates(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const { category, industry, search, tags } = req.query;

    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = category as SignageCategory;
    }

    if (industry) {
      where.industry = industry;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { detailedDescription: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (tags) {
      const tagArray = (tags as string).split(',').map(t => t.trim());
      where.tags = { hasSome: tagArray };
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        orderBy: [
          { usageCount: 'desc' },
          { name: 'asc' },
        ],
        skip,
        take: limit,
      }),
      prisma.template.count({ where }),
    ]);

    sendPaginated(res, templates, page, limit, total);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single template by ID
 */
export async function getTemplate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template || !template.isActive) {
      throw new NotFoundError('Template not found');
    }

    // Increment usage count
    await prisma.template.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });

    sendSuccess(res, template);
  } catch (error) {
    next(error);
  }
}

/**
 * Get template categories
 */
export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await prisma.template.groupBy({
      by: ['category'],
      _count: { category: true },
      where: { isActive: true },
    });

    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
}

/**
 * Get template industries
 */
export async function getIndustries(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      select: { industry: true },
      distinct: ['industry'],
    });

    const industries = templates
      .map(t => t.industry)
      .filter(Boolean)
      .sort();

    sendSuccess(res, industries);
  } catch (error) {
    next(error);
  }
}

/**
 * Get popular templates
 */
export async function getPopularTemplates(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const templates = await prisma.template.findMany({
      where: { isActive: true },
      orderBy: { usageCount: 'desc' },
      take: limit,
    });

    sendSuccess(res, templates);
  } catch (error) {
    next(error);
  }
}

// =====================
// Custom Templates (User's own templates)
// =====================

/**
 * Get all custom templates for the current user
 */
export async function getUserTemplates(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const { category, search } = req.query;

    const where: any = {
      userId: req.user!.id,
    };

    if (category) {
      where.category = category as SignageCategory;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [templates, total] = await Promise.all([
      prisma.customTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.customTemplate.count({ where }),
    ]);

    sendPaginated(res, templates, page, limit, total);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single custom template
 */
export async function getUserTemplate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const template = await prisma.customTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundError('Custom template not found');
    }

    if (template.userId !== req.user!.id && !template.isPublic) {
      throw new ForbiddenError('You do not have access to this template');
    }

    sendSuccess(res, template);
  } catch (error) {
    next(error);
  }
}

/**
 * Create a custom template
 */
export async function createUserTemplate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const template = await prisma.customTemplate.create({
      data: {
        ...req.body,
        userId: req.user!.id,
      },
    });

    sendCreated(res, template, 'Custom template created successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update a custom template
 */
export async function updateUserTemplate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.customTemplate.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new NotFoundError('Custom template not found');
    }

    if (existing.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have permission to update this template');
    }

    const template = await prisma.customTemplate.update({
      where: { id },
      data: req.body,
    });

    sendSuccess(res, template, 'Custom template updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a custom template
 */
export async function deleteUserTemplate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.customTemplate.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new NotFoundError('Custom template not found');
    }

    if (existing.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have permission to delete this template');
    }

    await prisma.customTemplate.delete({ where: { id } });

    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

export default {
  getAllTemplates,
  getTemplate,
  getCategories,
  getIndustries,
  getPopularTemplates,
  getUserTemplates,
  getUserTemplate,
  createUserTemplate,
  updateUserTemplate,
  deleteUserTemplate,
};
