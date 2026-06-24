import fs from 'node:fs/promises';
import path from 'node:path';
import { fileRepository } from '../repositories';
import { UPLOAD_DIR } from '../middleware/upload';
import { CrudService } from './CrudService';
import type { IFileMeta } from '../models/FileMeta';
import { AppError } from '../utils/AppError';

class FileService extends CrudService<IFileMeta> {
  constructor() {
    super(fileRepository, 'File', {
      searchableFields: ['originalName', 'mimeType'],
      filterableFields: ['mimeType', 'uploadedBy'],
    });
  }

  async saveUploaded(
    files: Express.Multer.File[],
    uploadedBy?: string,
  ): Promise<IFileMeta[]> {
    if (!files || files.length === 0) {
      throw AppError.badRequest('No files were uploaded');
    }

    const records = await Promise.all(
      files.map((file) =>
        fileRepository.create({
          originalName: file.originalname,
          storedName: file.filename,
          mimeType: file.mimetype,
          size: file.size,
          url: `/uploads/${file.filename}`,
          uploadedBy,
        }),
      ),
    );

    return records.map((record) => record.toJSON() as unknown as IFileMeta);
  }

  async removeWithFile(id: string): Promise<void> {
    const doc = await fileRepository.findById(id);
    if (!doc) throw AppError.notFound('File not found');

    const absolutePath = path.join(UPLOAD_DIR, doc.storedName);
    await fs.unlink(absolutePath).catch(() => undefined); // tolerate already-deleted files
    await fileRepository.deleteById(id);
  }
}

export const fileService = new FileService();
