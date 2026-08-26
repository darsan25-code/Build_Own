import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/security/auth';
import { validateFileUpload } from '@/server/services/securityService';
import { db } from '@/server/db/client';
import { logAuditEvent } from '@/server/security/auditLogger';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'DOCUMENT';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
    }

    // Validate MIME type, size limit (10MB), and extension
    const validated = validateFileUpload({
      name: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    });

    const fileAsset = await db.fileAsset.create({
      data: {
        originalName: validated.sanitizedName,
        mimeType: file.type,
        sizeBytes: file.size,
        storageKey: validated.storageKey,
        publicUrl: `https://storage.acm.org/${validated.storageKey}`,
        category,
        uploaderId: user.id,
      },
    });

    await logAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: 'FILE_UPLOAD',
      resource: 'FileAsset',
      resourceId: fileAsset.id,
      details: { originalName: file.name, mimeType: file.type, sizeBytes: file.size },
    });

    return NextResponse.json({ success: true, fileAsset }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 400 });
  }
}
