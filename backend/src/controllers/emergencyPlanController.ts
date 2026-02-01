import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';

/**
 * Get all emergency plans for the current user
 */
export async function getAllEmergencyPlans(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const { search, emergencyType, isActive } = req.query;

    const where: any = {
      userId: req.user!.id,
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (emergencyType) {
      where.emergencyType = emergencyType;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [plans, total] = await Promise.all([
      prisma.emergencyPlan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.emergencyPlan.count({ where }),
    ]);

    sendPaginated(res, plans, page, limit, total);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single emergency plan by ID
 */
export async function getEmergencyPlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const plan = await prisma.emergencyPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundError('Emergency plan not found');
    }

    if (plan.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have access to this plan');
    }

    sendSuccess(res, plan);
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new emergency plan
 */
export async function createEmergencyPlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const plan = await prisma.emergencyPlan.create({
      data: {
        ...req.body,
        userId: req.user!.id,
      },
    });

    sendCreated(res, plan, 'Emergency plan created successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update an emergency plan
 */
export async function updateEmergencyPlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.emergencyPlan.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new NotFoundError('Emergency plan not found');
    }

    if (existing.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have permission to update this plan');
    }

    const plan = await prisma.emergencyPlan.update({
      where: { id },
      data: req.body,
    });

    sendSuccess(res, plan, 'Emergency plan updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an emergency plan
 */
export async function deleteEmergencyPlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.emergencyPlan.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new NotFoundError('Emergency plan not found');
    }

    if (existing.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have permission to delete this plan');
    }

    await prisma.emergencyPlan.delete({ where: { id } });

    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

/**
 * Duplicate an emergency plan
 */
export async function duplicateEmergencyPlan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const original = await prisma.emergencyPlan.findUnique({
      where: { id },
    });

    if (!original) {
      throw new NotFoundError('Emergency plan not found');
    }

    if (original.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have access to this plan');
    }

    const { id: _, createdAt, updatedAt, ...data } = original;

    const duplicate = await prisma.emergencyPlan.create({
      data: {
        ...data,
        name: `${original.name} (Copy)`,
        userId: req.user!.id,
      },
    });

    sendCreated(res, duplicate, 'Emergency plan duplicated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get emergency types (distinct values)
 */
export async function getEmergencyTypes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const plans = await prisma.emergencyPlan.findMany({
      where: { userId: req.user!.id },
      select: { emergencyType: true },
      distinct: ['emergencyType'],
    });

    const types = plans
      .map(p => p.emergencyType)
      .filter(Boolean)
      .sort();

    sendSuccess(res, types);
  } catch (error) {
    next(error);
  }
}

export default {
  getAllEmergencyPlans,
  getEmergencyPlan,
  createEmergencyPlan,
  updateEmergencyPlan,
  deleteEmergencyPlan,
  duplicateEmergencyPlan,
  getEmergencyTypes,
};
