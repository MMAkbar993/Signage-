import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { getFileUrl, deleteFile } from '../middleware/upload';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import config from '../config';

/**
 * Upload a single file
 */
export async function uploadFile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      throw new BadRequestError('No file uploaded');
    }

    const upload = await prisma.upload.create({
      data: {
        userId: req.user?.id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: getFileUrl(req.file.path),
      },
    });

    sendCreated(res, {
      id: upload.id,
      filename: upload.filename,
      originalName: upload.originalName,
      url: upload.url,
      size: upload.size,
      mimeType: upload.mimeType,
    }, 'File uploaded successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new BadRequestError('No files uploaded');
    }

    const uploads = await Promise.all(
      files.map(file =>
        prisma.upload.create({
          data: {
            userId: req.user?.id,
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            url: getFileUrl(file.path),
          },
        })
      )
    );

    sendCreated(res, uploads.map(upload => ({
      id: upload.id,
      filename: upload.filename,
      originalName: upload.originalName,
      url: upload.url,
      size: upload.size,
      mimeType: upload.mimeType,
    })), `${files.length} files uploaded successfully`);
  } catch (error) {
    next(error);
  }
}

/**
 * Upload and process image (resize, optimize)
 */
export async function uploadImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      throw new BadRequestError('No image uploaded');
    }

    const { width, height, quality } = req.query;
    
    const outputPath = req.file.path.replace(
      path.extname(req.file.path),
      `-processed${path.extname(req.file.path)}`
    );

    // Process image with sharp
    let sharpInstance = sharp(req.file.path);

    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize(
        width ? parseInt(width as string) : undefined,
        height ? parseInt(height as string) : undefined,
        { fit: 'inside', withoutEnlargement: true }
      );
    }

    // Set quality
    const q = quality ? parseInt(quality as string) : 80;
    
    if (req.file.mimetype === 'image/jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality: q });
    } else if (req.file.mimetype === 'image/png') {
      sharpInstance = sharpInstance.png({ quality: q });
    } else if (req.file.mimetype === 'image/webp') {
      sharpInstance = sharpInstance.webp({ quality: q });
    }

    await sharpInstance.toFile(outputPath);

    // Get file stats
    const stats = fs.statSync(outputPath);

    // Delete original file
    await deleteFile(req.file.path);

    const upload = await prisma.upload.create({
      data: {
        userId: req.user?.id,
        filename: path.basename(outputPath),
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: stats.size,
        path: outputPath,
        url: getFileUrl(outputPath),
      },
    });

    sendCreated(res, {
      id: upload.id,
      filename: upload.filename,
      originalName: upload.originalName,
      url: upload.url,
      size: upload.size,
      mimeType: upload.mimeType,
    }, 'Image uploaded and processed successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Convert image to base64
 */
export async function imageToBase64(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      throw new BadRequestError('No image uploaded');
    }

    const base64 = fs.readFileSync(req.file.path).toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

    // Delete uploaded file after conversion
    await deleteFile(req.file.path);

    sendSuccess(res, { base64: dataUrl }, 'Image converted to base64');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an uploaded file
 */
export async function deleteUpload(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const upload = await prisma.upload.findUnique({
      where: { id },
    });

    if (!upload) {
      throw new NotFoundError('Upload not found');
    }

    // Check ownership
    if (upload.userId && upload.userId !== req.user!.id) {
      throw new NotFoundError('Upload not found');
    }

    // Delete file from disk
    await deleteFile(upload.path);

    // Delete database record
    await prisma.upload.delete({ where: { id } });

    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's uploads
 */
export async function getUserUploads(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const uploads = await prisma.upload.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        originalName: true,
        url: true,
        size: true,
        mimeType: true,
        createdAt: true,
      },
    });

    sendSuccess(res, uploads);
  } catch (error) {
    next(error);
  }
}

export default {
  uploadFile,
  uploadFiles,
  uploadImage,
  imageToBase64,
  deleteUpload,
  getUserUploads,
};
