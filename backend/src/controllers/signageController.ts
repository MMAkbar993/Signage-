import { Request, Response, NextFunction } from 'express';
import { Prisma, SignageCategory } from '@prisma/client';
import { getParam } from '../utils/request';
import { prisma } from '../config/database';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';

/**
 * Get all signages for the current user
 */
export async function getAllSignages(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const category = getParam(req, 'category');
    const search = getParam(req, 'search');
    const isTemplate = getParam(req, 'isTemplate');

    // Build where clause
    const where: Prisma.SignageWhereInput = {
      userId: req.user!.id,
    };

    if (category) {
      where.category = category as SignageCategory;
    }

    if (isTemplate !== undefined) {
      where.isTemplate = isTemplate === 'true';
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get signages with pagination
    const [signages, total] = await Promise.all([
      prisma.signage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.signage.count({ where }),
    ]);

    sendPaginated(res, signages, page, limit, total);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single signage by ID
 */
export async function getSignage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    const signage = await prisma.signage.findUnique({
      where: { id },
    });

    if (!signage) {
      throw new NotFoundError('Signage not found');
    }

    // Check ownership
    if (signage.userId !== req.user!.id && !signage.isPublic) {
      throw new ForbiddenError('You do not have access to this signage');
    }

    sendSuccess(res, signage);
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new signage
 */
export async function createSignage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const signage = await prisma.signage.create({
      data: {
        ...req.body,
        userId: req.user!.id,
      } as unknown as Prisma.SignageCreateInput,
    });

    // Track signage creation
    await prisma.signageHistory.create({
      data: {
        userId: req.user!.id,
        signageId: signage.id,
        action: 'created',
        category: signage.category,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    sendCreated(res, signage, 'Signage created successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update a signage
 */
export async function updateSignage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    // Check if signage exists and belongs to user
    const existing = await prisma.signage.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new NotFoundError('Signage not found');
    }

    if (existing.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have permission to update this signage');
    }

    const signage = await prisma.signage.update({
      where: { id },
      data: req.body,
    });

    sendSuccess(res, signage, 'Signage updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a signage
 */
export async function deleteSignage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    // Check if signage exists and belongs to user
    const existing = await prisma.signage.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new NotFoundError('Signage not found');
    }

    if (existing.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have permission to delete this signage');
    }

    await prisma.signage.delete({ where: { id } });

    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

/**
 * Duplicate a signage
 */
export async function duplicateSignage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    const original = await prisma.signage.findUnique({
      where: { id },
    });

    if (!original) {
      throw new NotFoundError('Signage not found');
    }

    // Check access
    if (original.userId !== req.user!.id && !original.isPublic) {
      throw new ForbiddenError('You do not have access to this signage');
    }

    // Create duplicate
    const { id: _, createdAt, updatedAt, ...data } = original;
    
    const duplicate = await prisma.signage.create({
      data: {
        ...data,
        customPPEImages: data.customPPEImages ?? Prisma.JsonNull,
        emergencyContacts: data.emergencyContacts ?? Prisma.JsonNull,
        qrCodeConfig: data.qrCodeConfig ?? Prisma.JsonNull,
        title: `${original.title} (Copy)`,
        userId: req.user!.id,
        isPublic: false,
      } as unknown as Prisma.SignageCreateInput,
    });

    sendCreated(res, duplicate, 'Signage duplicated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get public signages
 */
export async function getPublicSignages(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const category = getParam(req, 'category');
    const search = getParam(req, 'search');

    const where: Prisma.SignageWhereInput = {
      isPublic: true,
    };

    if (category) {
      where.category = category as SignageCategory;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [signages, total] = await Promise.all([
      prisma.signage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          thumbnail: true,
          createdAt: true,
        },
      }),
      prisma.signage.count({ where }),
    ]);

    sendPaginated(res, signages, page, limit, total);
  } catch (error) {
    next(error);
  }
}

/**
 * Track signage download
 */
export async function trackDownload(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;
    const { format } = req.body;

    await prisma.signageHistory.create({
      data: {
        userId: req.user?.id,
        signageId: id,
        action: 'downloaded',
        metadata: { format },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    sendSuccess(res, null, 'Download tracked');
  } catch (error) {
    next(error);
  }
}

export default {
  getAllSignages,
  getSignage,
  createSignage,
  updateSignage,
  deleteSignage,
  duplicateSignage,
  getPublicSignages,
  trackDownload,
};
