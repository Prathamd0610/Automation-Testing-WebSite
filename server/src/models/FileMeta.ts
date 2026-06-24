import { Schema, model, type HydratedDocument } from 'mongoose';

export interface IFileMeta {
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FileMetaDocument = HydratedDocument<IFileMeta>;

const fileMetaSchema = new Schema<IFileMeta>(
  {
    originalName: { type: String, required: true },
    storedName: { type: String, required: true, unique: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
    url: { type: String, required: true },
    uploadedBy: { type: String, lowercase: true, trim: true },
  },
  { timestamps: true },
);

export const FileMeta = model<IFileMeta>('FileMeta', fileMetaSchema);
