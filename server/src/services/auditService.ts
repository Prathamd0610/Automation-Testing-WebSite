import type { Request } from 'express';
import { auditLogRepository } from '../repositories';
import { logger } from '../config/logger';

interface AuditInput {
  /** Email (or id) of the admin performing the action. */
  actor?: string;
  /** Dotted action name, e.g. `user.role.update`. */
  action: string;
  /** Affected entity name, e.g. `User`, `Account`. */
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  req?: Request;
}

/**
 * Best-effort audit log writer for sensitive admin actions. Never throws — a
 * failure to record an audit entry must not break the underlying operation.
 */
export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    await auditLogRepository.create({
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      actor: input.actor,
      ip: input.req?.ip,
      userAgent: input.req?.headers['user-agent'],
      metadata: input.metadata,
    });
  } catch (error) {
    logger.error(`Failed to record audit (${input.action}): ${(error as Error).message}`);
  }
}
