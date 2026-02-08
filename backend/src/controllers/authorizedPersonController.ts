import { Request, Response, NextFunction } from 'express';
import { getParam } from '../utils/request';
import { prisma } from '../config/database';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';

/**
 * Get all authorized persons for the current user
 */
export async function getAllAuthorizedPersons(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const search = getParam(req, 'search');
    const department = getParam(req, 'department');
    const shift = getParam(req, 'shift');

    const where: Record<string, unknown> = {
      userId: req.user!.id,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
        { designation: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (department) {
      where.department = department;
    }

    if (shift) {
      where.shift = shift;
    }

    const [persons, total] = await Promise.all([
      prisma.authorizedPerson.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.authorizedPerson.count({ where }),
    ]);

    sendPaginated(res, persons, page, limit, total);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single authorized person by ID
 */
export async function getAuthorizedPerson(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    const person = await prisma.authorizedPerson.findUnique({
      where: { id },
    });

    if (!person) {
      throw new NotFoundError('Authorized person not found');
    }

    if (person.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have access to this record');
    }

    sendSuccess(res, person);
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new authorized person
 */
export async function createAuthorizedPerson(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const person = await prisma.authorizedPerson.create({
      data: {
        ...req.body,
        userId: req.user!.id,
      },
    });

    sendCreated(res, person, 'Authorized person created successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Create multiple authorized persons (bulk import)
 */
export async function bulkCreateAuthorizedPersons(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { persons } = req.body;

    const data = persons.map((person: any) => ({
      ...person,
      userId: req.user!.id,
    }));

    const result = await prisma.authorizedPerson.createMany({
      data,
      skipDuplicates: true,
    });

    sendCreated(res, { count: result.count }, `${result.count} authorized persons created successfully`);
  } catch (error) {
    next(error);
  }
}

/**
 * Update an authorized person
 */
export async function updateAuthorizedPerson(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    const existing = await prisma.authorizedPerson.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new NotFoundError('Authorized person not found');
    }

    if (existing.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have permission to update this record');
    }

    const person = await prisma.authorizedPerson.update({
      where: { id },
      data: req.body,
    });

    sendSuccess(res, person, 'Authorized person updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an authorized person
 */
export async function deleteAuthorizedPerson(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req, 'id')!;

    const existing = await prisma.authorizedPerson.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      throw new NotFoundError('Authorized person not found');
    }

    if (existing.userId !== req.user!.id) {
      throw new ForbiddenError('You do not have permission to delete this record');
    }

    await prisma.authorizedPerson.delete({ where: { id } });

    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete multiple authorized persons
 */
export async function bulkDeleteAuthorizedPersons(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;

    const result = await prisma.authorizedPerson.deleteMany({
      where: {
        id: { in: ids },
        userId: req.user!.id,
      },
    });

    sendSuccess(res, { count: result.count }, `${result.count} authorized persons deleted successfully`);
  } catch (error) {
    next(error);
  }
}

/**
 * Get departments (distinct values)
 */
export async function getDepartments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const persons = await prisma.authorizedPerson.findMany({
      where: { userId: req.user!.id },
      select: { department: true },
      distinct: ['department'],
    });

    const departments = persons
      .map(p => p.department)
      .filter(Boolean)
      .sort();

    sendSuccess(res, departments);
  } catch (error) {
    next(error);
  }
}

/**
 * Get shifts (distinct values)
 */
export async function getShifts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const persons = await prisma.authorizedPerson.findMany({
      where: { userId: req.user!.id },
      select: { shift: true },
      distinct: ['shift'],
    });

    const shifts = persons
      .map(p => p.shift)
      .filter(Boolean)
      .sort();

    sendSuccess(res, shifts);
  } catch (error) {
    next(error);
  }
}

export default {
  getAllAuthorizedPersons,
  getAuthorizedPerson,
  createAuthorizedPerson,
  bulkCreateAuthorizedPersons,
  updateAuthorizedPerson,
  deleteAuthorizedPerson,
  bulkDeleteAuthorizedPersons,
  getDepartments,
  getShifts,
};
