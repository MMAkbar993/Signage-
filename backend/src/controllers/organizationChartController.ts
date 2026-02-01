import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';

/**
 * Get all organization charts for the current user
 */
export async function getAllOrganizationCharts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const { search, isActive } = req.query;

    const where: any = {
      userId: req.user!.id,
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [charts, total] = await Promise.all([
      prisma.organizationChart.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.organizationChart.count({ where }),
    ]);

    sendPaginated(res, charts, page, limit, total);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single organization chart by ID
 */
export async function getOrganizationChart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const chart = await prisma.organizationChart.findUnique({
      where: { id },
    });

    if (!chart) {
      throw new NotFoundError('Organization chart not found');
    }

    if (chart.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have access to this chart');
    }

    sendSuccess(res, chart);
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new organization chart
 */
export async function createOrganizationChart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const chart = await prisma.organizationChart.create({
      data: {
        ...req.body,
        userId: req.user!.id,
      },
    });

    sendCreated(res, chart, 'Organization chart created successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update an organization chart
 */
export async function updateOrganizationChart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.organizationChart.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new NotFoundError('Organization chart not found');
    }

    if (existing.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have permission to update this chart');
    }

    const chart = await prisma.organizationChart.update({
      where: { id },
      data: req.body,
    });

    sendSuccess(res, chart, 'Organization chart updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an organization chart
 */
export async function deleteOrganizationChart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.organizationChart.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new NotFoundError('Organization chart not found');
    }

    if (existing.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have permission to delete this chart');
    }

    await prisma.organizationChart.delete({ where: { id } });

    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

/**
 * Duplicate an organization chart
 */
export async function duplicateOrganizationChart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const original = await prisma.organizationChart.findUnique({
      where: { id },
    });

    if (!original) {
      throw new NotFoundError('Organization chart not found');
    }

    if (original.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have access to this chart');
    }

    const { id: _, createdAt, updatedAt, ...data } = original;

    const duplicate = await prisma.organizationChart.create({
      data: {
        ...data,
        name: `${original.name} (Copy)`,
        userId: req.user!.id,
      },
    });

    sendCreated(res, duplicate, 'Organization chart duplicated successfully');
  } catch (error) {
    next(error);
  }
}

export default {
  getAllOrganizationCharts,
  getOrganizationChart,
  createOrganizationChart,
  updateOrganizationChart,
  deleteOrganizationChart,
  duplicateOrganizationChart,
};
