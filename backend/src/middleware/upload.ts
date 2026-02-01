import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';
import { BadRequestError } from '../utils/errors';

// Ensure upload directory exists
const uploadDir = path.resolve(config.upload.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create subdirectories for different file types
const subdirs = ['images', 'logos', 'signages', 'temp'];
subdirs.forEach(dir => {
  const subdir = path.join(uploadDir, dir);
  if (!fs.existsSync(subdir)) {
    fs.mkdirSync(subdir, { recursive: true });
  }
});

/**
 * Storage configuration for multer
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine subdirectory based on field name or mime type
    let subdir = 'temp';
    
    if (file.fieldname.includes('logo')) {
      subdir = 'logos';
    } else if (file.fieldname.includes('signage') || file.fieldname.includes('preview')) {
      subdir = 'signages';
    } else if (file.mimetype.startsWith('image/')) {
      subdir = 'images';
    }

    cb(null, path.join(uploadDir, subdir));
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

/**
 * File filter to validate file types
 */
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = config.upload.allowedMimeTypes;

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError(`File type ${file.mimetype} is not allowed`));
  }
};

/**
 * Image-only file filter
 */
const imageFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];

  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only image files are allowed'));
  }
};

/**
 * Default multer upload instance
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 10, // Maximum files per request
  },
});

/**
 * Image-only upload instance
 */
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 5,
  },
});

/**
 * Memory storage for processing before saving
 */
export const uploadToMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 5,
  },
});

/**
 * Single file upload middleware
 */
export const singleUpload = (fieldName: string) => upload.single(fieldName);

/**
 * Multiple files upload middleware
 */
export const multipleUpload = (fieldName: string, maxCount: number) =>
  upload.array(fieldName, maxCount);

/**
 * Multiple fields upload middleware
 */
export const fieldsUpload = (fields: { name: string; maxCount: number }[]) =>
  upload.fields(fields);

/**
 * Get file URL from path
 */
export function getFileUrl(filePath: string): string {
  const relativePath = filePath.replace(uploadDir, '').replace(/\\/g, '/');
  return `/uploads${relativePath}`;
}

/**
 * Delete file from storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export default {
  upload,
  uploadImage,
  uploadToMemory,
  singleUpload,
  multipleUpload,
  fieldsUpload,
  getFileUrl,
  deleteFile,
};
