import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendPaginated, sendNoContent } from '../utils/response';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { hashPassword } from '../utils/password';
import { getParam } from '../utils/request';
import { UserRole } from '@prisma/client';

/**
 * Get dashboard stats
 */
export async function getDashboardStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [
      totalUsers,
      totalSignages,
      totalTemplates,
      totalAuthorizedPersons,
      totalEmergencyPlans,
      recentSignages,
      categoryStats,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.signage.count(),
      prisma.template.count({ where: { isActive: true } }),
      prisma.authorizedPerson.count(),
      prisma.emergencyPlan.count(),
      prisma.signage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          category: true,
          createdAt: true,
          user: { select: { email: true } },
        },
      }),
      prisma.signage.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
    ]);

    sendSuccess(res, {
      totalUsers,
      totalSignages,
      totalTemplates,
      totalAuthorizedPersons,
      totalEmergencyPlans,
      recentSignages,
      categoryStats,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all users (admin)
 */
export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const search = getParam(req, 'search');
    const role = getParam(req, 'role');
    const isActive = getParam(req, 'isActive');

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              signages: true,
              authorizedPersons: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    sendPaginated(res, users, page, limit, total);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single user (admin)
 */
export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            signages: true,
            authorizedPersons: true,
            emergencyPlans: true,
            organizationCharts: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

/**
 * Update user (admin)
 */
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;
    const { firstName, lastName, role, isActive } = req.body;

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!existing) {
      throw new NotFoundError('User not found');
    }

    // Prevent non-super admins from modifying other admins
    if (existing.role === UserRole.SUPER_ADMIN && req.user!.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenError('Cannot modify super admin');
    }

    // Prevent changing role to super admin unless you are super admin
    if (role === UserRole.SUPER_ADMIN && req.user!.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenError('Cannot assign super admin role');
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        role,
        isActive,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    sendSuccess(res, user, 'User updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Reset user password (admin)
 */
export async function resetUserPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;
    const { newPassword } = req.body;

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!existing) {
      throw new NotFoundError('User not found');
    }

    // Only super admin can reset other admin passwords
    if (
      (existing.role === UserRole.ADMIN || existing.role === UserRole.SUPER_ADMIN) &&
      req.user!.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenError('Cannot reset admin password');
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    // Invalidate all sessions
    await prisma.session.deleteMany({
      where: { userId: id },
    });

    sendSuccess(res, null, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete user (admin)
 */
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    if (id === req.user!.id) {
      throw new BadRequestError('Cannot delete your own account');
    }

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!existing) {
      throw new NotFoundError('User not found');
    }

    // Only super admin can delete other admins
    if (existing.role !== UserRole.USER && req.user!.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenError('Cannot delete admin users');
    }

    await prisma.user.delete({ where: { id } });

    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

/**
 * Get signage history (admin)
 */
export async function getSignageHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const action = getParam(req, 'action');
    const category = getParam(req, 'category');
    const userId = getParam(req, 'userId');

    const where: Record<string, unknown> = {};

    if (action) {
      where.action = action;
    }

    if (category) {
      where.category = category;
    }

    if (userId) {
      where.userId = userId;
    }

    const [history, total] = await Promise.all([
      prisma.signageHistory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.signageHistory.count({ where }),
    ]);

    sendPaginated(res, history, page, limit, total);
  } catch (error) {
    next(error);
  }
}

/**
 * Manage templates (admin) - Create
 */
export async function createTemplate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const template = await prisma.template.create({
      data: req.body,
    });

    sendSuccess(res, template, 'Template created successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Manage templates (admin) - Update
 */
export async function updateTemplate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    const template = await prisma.template.update({
      where: { id },
      data: req.body,
    });

    sendSuccess(res, template, 'Template updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Manage templates (admin) - Delete
 */
export async function deleteTemplate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    await prisma.template.delete({ where: { id } });

    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

export default {
  getDashboardStats,
  getAllUsers,
  getUser,
  updateUser,
  resetUserPassword,
  deleteUser,
  getSignageHistory,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
