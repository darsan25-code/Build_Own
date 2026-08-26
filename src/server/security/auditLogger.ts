import { db } from '../db/client';

export interface AuditLogOptions {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  correlationId?: string | null;
  details?: Record<string, any> | string;
}

export async function logAuditEvent(options: AuditLogOptions) {
  try {
    const detailsString =
      typeof options.details === 'object'
        ? JSON.stringify(options.details)
        : options.details;

    const log = await db.auditLog.create({
      data: {
        actorId: options.actorId,
        actorEmail: options.actorEmail,
        action: options.action,
        resource: options.resource,
        resourceId: options.resourceId,
        ipAddress: options.ipAddress || '127.0.0.1',
        userAgent: options.userAgent || 'ACM System',
        correlationId: options.correlationId || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        details: detailsString,
      },
    });

    console.log(`[AUDIT_LOG] ${options.action} on ${options.resource} (${options.resourceId || 'N/A'}) by ${options.actorEmail || 'System'}`);
    return log;
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
