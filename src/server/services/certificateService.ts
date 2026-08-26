import { db } from '../db/client';
import { logAuditEvent } from '../security/auditLogger';

export async function issueCertificate(userId: string, eventId: string) {
  const registration = await db.eventRegistration.findUnique({
    where: { eventId_userId: { eventId, userId } },
    include: { event: true, user: true },
  });

  if (!registration || !registration.attended) {
    throw new Error('User has not attended this event or is not registered.');
  }

  if (!registration.event.certificateEligible) {
    throw new Error('This event does not issue certificates.');
  }

  const certificateCode = `ACM-CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const cert = await db.certificate.upsert({
    where: { userId_eventId: { userId, eventId } },
    update: {},
    create: {
      certificateCode,
      userId,
      eventId,
      pdfAssetUrl: `/api/certificates/verify?code=${certificateCode}`,
    },
    include: { user: true, event: true },
  });

  await logAuditEvent({
    actorId: userId,
    action: 'ISSUE_CERTIFICATE',
    resource: 'Certificate',
    resourceId: cert.id,
    details: { certificateCode },
  });

  return cert;
}

export async function verifyCertificate(certificateCode: string) {
  const cert = await db.certificate.findUnique({
    where: { certificateCode },
    include: {
      user: { select: { name: true, email: true, institution: true } },
      event: { select: { title: true, startTime: true, chapter: true } },
    },
  });

  if (!cert) return null;

  // Increment verification count
  await db.certificate.update({
    where: { id: cert.id },
    data: { verifiedCount: { increment: 1 } },
  });

  return cert;
}
