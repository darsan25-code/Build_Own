import { NextResponse } from 'next/server';
import { getSessionUser } from '@/server/security/auth';
import { validateFileUpload } from '@/server/services/securityService';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { filename, mimeType, sizeBytes } = body;

    // Validate size and extensions safely inside security service
    validateFileUpload({
      name: filename,
      mimeType,
      sizeBytes,
    });

    const fileId = Math.random().toString(36).substring(2, 15);
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageKey = `uploads/user_${user.id}/${fileId}_${sanitizedName}`;

    // Return signed URL upload structure (mocked pre-signed AWS S3 URL for production readiness)
    const signedUploadUrl = `https://acm-object-storage.s3.amazonaws.com/${storageKey}?AWSAccessKeyId=AKIAIOSFODNN7EXAMPLE&Signature=vjbyPxybdZaNmGa%2ByT272YEAiv4%3D&Expires=${Math.floor(Date.now() / 1000) + 900}`;

    return NextResponse.json({
      success: true,
      uploadUrl: signedUploadUrl,
      publicUrl: `/api/assets/${storageKey}`,
      storageKey,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to generate signed URL' }, { status: 400 });
  }
}
