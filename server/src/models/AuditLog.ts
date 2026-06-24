import { Schema, model, type HydratedDocument } from 'mongoose';

export interface IAuditLog {
  action: string;
  entity: string;
  entityId?: string;
  actor?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type AuditLogDocument = HydratedDocument<IAuditLog>;

const auditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: String },
    actor: { type: String, lowercase: true, trim: true, index: true },
    ip: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

// Retain audit logs for 90 days via TTL index.
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
