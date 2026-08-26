import { NextResponse } from 'next/server';
import { verifyCertificate } from '@/server/services/certificateService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Certificate code is required' }, { status: 400 });
  }

  const cert = await verifyCertificate(code);
  if (!cert) {
    return NextResponse.json({ error: 'Certificate not found or invalid' }, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    certificate: {
      code: cert.certificateCode,
      recipient: cert.user.name,
      institution: cert.user.institution?.name,
      event: cert.event.title,
      date: cert.issuedAt,
      verifiedCount: cert.verifiedCount,
    },
  });
}
