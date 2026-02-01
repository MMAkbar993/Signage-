import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../utils/errors';

/**
 * Get company branding for the current user
 */
export async function getBranding(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const branding = await prisma.companyBranding.findUnique({
      where: { userId: req.user!.id },
    });

    sendSuccess(res, branding || {
      companyName: '',
      contactInfo: '',
      clientLogo: null,
      contractorLogo: null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update or create company branding
 */
export async function updateBranding(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { companyName, contactInfo, clientLogo, contractorLogo } = req.body;

    const branding = await prisma.companyBranding.upsert({
      where: { userId: req.user!.id },
      update: {
        companyName,
        contactInfo,
        clientLogo,
        contractorLogo,
      },
      create: {
        userId: req.user!.id,
        companyName,
        contactInfo,
        clientLogo,
        contractorLogo,
      },
    });

    sendSuccess(res, branding, 'Branding updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete branding
 */
export async function deleteBranding(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await prisma.companyBranding.deleteMany({
      where: { userId: req.user!.id },
    });

    sendSuccess(res, null, 'Branding deleted successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Upload logo
 */
export async function uploadLogo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { type } = req.params; // 'client' or 'contractor'
    
    if (!req.file) {
      throw new NotFoundError('No file uploaded');
    }

    // Convert to base64 for storage (or you could save the file path)
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const field = type === 'client' ? 'clientLogo' : 'contractorLogo';

    const branding = await prisma.companyBranding.upsert({
      where: { userId: req.user!.id },
      update: { [field]: base64 },
      create: {
        userId: req.user!.id,
        [field]: base64,
      },
    });

    sendSuccess(res, { [field]: base64 }, 'Logo uploaded successfully');
  } catch (error) {
    next(error);
  }
}

export default {
  getBranding,
  updateBranding,
  deleteBranding,
  uploadLogo,
};
