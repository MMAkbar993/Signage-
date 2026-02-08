import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokenPair, verifyRefreshToken, getTokenExpiration } from '../utils/jwt';
import { sendSuccess, sendCreated } from '../utils/response';
import { UnauthorizedError, BadRequestError, ConflictError } from '../utils/errors';
import config from '../config';

/**
 * Register a new user
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, firstName, lastName, username } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // If username provided, check uniqueness
    if (username !== undefined && username !== null && String(username).trim() !== '') {
      const trimmed = String(username).trim().toLowerCase();
      const existingUsername = await prisma.user.findUnique({
        where: { username: trimmed },
      });
      if (existingUsername) {
        throw new ConflictError('Username is already taken');
      }
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);

    const createData: Prisma.UserCreateInput = {
      email,
      password: hashedPassword,
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      ...(username !== undefined && username !== null && String(username).trim() !== ''
        ? { username: String(username).trim().toLowerCase() }
        : {}),
    };

    const user = await prisma.user.create({
      data: createData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        expiresAt: getTokenExpiration(config.jwt.refreshExpiresIn),
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      },
    });

    sendCreated(res, {
      user,
      ...tokens,
    }, 'Registration successful');
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('Your account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        expiresAt: getTokenExpiration(config.jwt.refreshExpiresIn),
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      },
    });

    sendSuccess(res, {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new BadRequestError('Refresh token is required');
    }

    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Find session
    const session = await prisma.session.findUnique({
      where: { refreshToken: token },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedError('Session not found');
    }

    if (session.expiresAt < new Date()) {
      // Delete expired session
      await prisma.session.delete({ where: { id: session.id } });
      throw new UnauthorizedError('Session expired');
    }

    if (!session.user.isActive) {
      throw new UnauthorizedError('User account is deactivated');
    }

    // Generate new tokens
    const tokens = generateTokenPair({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
    });

    // Update session with new refresh token
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: getTokenExpiration(config.jwt.refreshExpiresIn),
      },
    });

    sendSuccess(res, tokens, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user
 */
export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      // Delete session if token provided
      await prisma.session.deleteMany({
        where: { refreshToken: token },
      });
    } else if (req.user) {
      // Delete all sessions for user if no token but authenticated
      await prisma.session.deleteMany({
        where: { userId: req.user.id },
      });
    }

    sendSuccess(res, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user
 */
export async function me(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        userSettings: true,
        companyBranding: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

/**
 * Update current user profile
 */
export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { firstName, lastName, avatar, username } = req.body;

    // If username is provided (non-empty), check it's unique and valid
    if (username !== undefined && username !== null && String(username).trim() !== '') {
      const trimmed = String(username).trim().toLowerCase();
      if (trimmed.length < 3) {
        throw new BadRequestError('Username must be at least 3 characters');
      }
      if (!/^[a-z0-9_-]+$/.test(trimmed)) {
        throw new BadRequestError('Username can only contain letters, numbers, underscore and hyphen');
      }
      const existing = await prisma.user.findFirst({
        where: {
          username: trimmed,
          id: { not: req.user!.id },
        },
      });
      if (existing) {
        throw new ConflictError('Username is already taken');
      }
    }

    const updateData: Prisma.UserUpdateInput = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (username !== undefined && username !== null && String(username).trim() !== '') {
      updateData.username = String(username).trim().toLowerCase();
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        updatedAt: true,
      },
    });

    sendSuccess(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Search users by username (for chat/friends)
 * Also searches firstName and lastName so users without usernames can be found
 */
export async function searchUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const q = (req.query.username as string)?.trim();
    if (!q || q.length < 2) {
      sendSuccess(res, []);
      return;
    }
    const term = q;
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        id: { not: req.user!.id },
        OR: [
          { username: { contains: term, mode: 'insensitive' } },
          { firstName: { contains: term, mode: 'insensitive' } },
          { lastName: { contains: term, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
      take: 20,
    });
    sendSuccess(res, users);
  } catch (error) {
    next(error);
  }
}

/**
 * Change password
 */
export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    // Hash new password and update
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Invalidate all sessions except current
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    sendSuccess(res, null, 'Password changed successfully. Please login again.');
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  refreshToken,
  logout,
  me,
  updateProfile,
  changePassword,
  searchUsers,
};
