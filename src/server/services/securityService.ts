import { db } from '../db/client';
import { Role } from '@/types';

// Allowed MIME types for uploaded files
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

export function validateFileUpload(file: { name: string; mimeType: string; sizeBytes: number }) {
  if (file.sizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error('File size exceeds maximum 10MB limit.');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimeType)) {
    throw new Error(`File type ${file.mimeType} is not permitted.`);
  }

  // Prevent path traversal and malicious characters in file name
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const fileExt = sanitizedName.split('.').pop()?.toLowerCase();

  const dangerousExtensions = ['exe', 'bat', 'cmd', 'sh', 'php', 'js', 'html', 'htpasswd', 'env'];
  if (fileExt && dangerousExtensions.includes(fileExt)) {
    throw new Error('Invalid file extension.');
  }

  return {
    sanitizedName,
    storageKey: `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 10)}_${sanitizedName}`,
  };
}

export async function authorizeEventAccess(userId: string, eventId: string): Promise<boolean> {
  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event) return false;

  // Public events can be viewed by anyone
  if (event.visibility === 'PUBLIC') return true;

  // Private events require chapter membership or admin rights
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return false;

  if (user.role === Role.PLATFORM_ADMIN) return true;

  const membership = await db.chapterMembership.findFirst({
    where: {
      userId,
      chapterId: event.chapterId,
      status: 'ACTIVE',
    },
  });

  return !!membership;
}
