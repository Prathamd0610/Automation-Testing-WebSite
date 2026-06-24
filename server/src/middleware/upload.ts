import path from 'node:path';
import fs from 'node:fs';
import multer from 'multer';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/json',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

/** Multer instance with size + MIME whitelisting for upload practice modules. */
export const upload = multer({
  storage,
  limits: { fileSize: env.MAX_UPLOAD_BYTES, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`Unsupported file type: ${file.mimetype}`, 400));
    }
  },
});
