import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';

/**
 * Get user settings
 */
export async function getSettings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId: req.user!.id },
    });

    sendSuccess(res, settings || {
      defaultPaperSize: 'a4',
      defaultOrientation: 'landscape',
      defaultResolution: '300dpi',
      autoFitToPage: true,
      printBackgrounds: true,
      language: 'en',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user settings
 */
export async function updateSettings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      defaultPaperSize,
      defaultOrientation,
      defaultResolution,
      autoFitToPage,
      printBackgrounds,
      language,
    } = req.body;

    const settings = await prisma.userSettings.upsert({
      where: { userId: req.user!.id },
      update: {
        defaultPaperSize,
        defaultOrientation,
        defaultResolution,
        autoFitToPage,
        printBackgrounds,
        language,
      },
      create: {
        userId: req.user!.id,
        defaultPaperSize: defaultPaperSize || 'a4',
        defaultOrientation: defaultOrientation || 'landscape',
        defaultResolution: defaultResolution || '300dpi',
        autoFitToPage: autoFitToPage ?? true,
        printBackgrounds: printBackgrounds ?? true,
        language: language || 'en',
      },
    });

    sendSuccess(res, settings, 'Settings updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Reset settings to defaults
 */
export async function resetSettings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await prisma.userSettings.deleteMany({
      where: { userId: req.user!.id },
    });

    sendSuccess(res, {
      defaultPaperSize: 'a4',
      defaultOrientation: 'landscape',
      defaultResolution: '300dpi',
      autoFitToPage: true,
      printBackgrounds: true,
      language: 'en',
    }, 'Settings reset to defaults');
  } catch (error) {
    next(error);
  }
}

export default {
  getSettings,
  updateSettings,
  resetSettings,
};
