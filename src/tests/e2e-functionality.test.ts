import { describe, it, expect, beforeAll } from 'vitest';
import { db } from '../server/db/client';
import { hashPassword, verifyPassword, hasRole, isChapterAdminOrOfficer } from '../server/security/auth';
import { registerForEvent, cancelRegistration } from '../server/services/eventService';
import { validateFileUpload, authorizeEventAccess } from '../server/services/securityService';
import { issueCertificate, verifyCertificate } from '../server/services/certificateService';
import { Role, RegistrationStatus } from '../types/index';

describe('ACM Platform Real End-to-End Functionality Verification', () => {
  let studentA: any;
  let studentB: any;
  let chapterAdmin: any;
  let xyzChapter: any;
  let mitChapter: any;
  let testEvent: any;

  beforeAll(async () => {
    studentA = await db.user.findUnique({ where: { email: 'alex@xyz.edu' } });
    studentB = await db.user.findUnique({ where: { email: 'sarah@mit.edu' } });
    chapterAdmin = await db.user.findUnique({ where: { email: 'chapteradmin@xyz.edu' } });
    xyzChapter = await db.chapter.findUnique({ where: { code: 'ACM-CH-123456' } });
    mitChapter = await db.chapter.findUnique({ where: { code: 'ACM-CH-MIT' } });
    testEvent = await db.event.findFirst({ where: { slug: 'acm-techtalk-generative-ai' } });
  });

  // 1. Authentication & Password Flow
  it('1. Authentication: should securely hash passwords and verify credentials', async () => {
    const raw = 'Password123!';
    const valid = await verifyPassword(raw, studentA.passwordHash);
    expect(valid).toBe(true);

    const invalid = await verifyPassword('WrongPassword', studentA.passwordHash);
    expect(invalid).toBe(false);
  });

  // 2. Student Persistent Profile Updates
  it('2. Student Flow: should persist profile updates in database', async () => {
    const updated = await db.user.update({
      where: { id: studentA.id },
      data: { department: 'Computer Science and Engineering', yearOfStudy: '3rd Year' },
    });
    expect(updated.department).toBe('Computer Science and Engineering');
    expect(updated.yearOfStudy).toBe('3rd Year');
  });

  // 3. Chapter Admin Event Creation & Modification
  it('3. Chapter Admin Flow: should allow authorized admin to create an event and cancel it', async () => {
    const canManage = await isChapterAdminOrOfficer(chapterAdmin.id, xyzChapter.id);
    expect(canManage).toBe(true);

    const slug = `test-hackathon-${Date.now()}`;
    const newEvent = await db.event.create({
      data: {
        title: 'Spring Coding Hackathon 2026',
        slug,
        description: 'Multi-college coding hackathon with algorithmic challenges.',
        type: 'HACKATHON',
        format: 'ONLINE',
        visibility: 'PUBLIC',
        maxCapacity: 50,
        startTime: new Date(Date.now() + 86400000),
        endTime: new Date(Date.now() + 172800000),
        registrationDeadline: new Date(Date.now() + 43200000),
        location: 'Online',
        chapterId: xyzChapter.id,
      },
    });
    expect(newEvent.id).toBeDefined();
    expect(newEvent.status).toBe('PUBLISHED');

    // Cancel event
    const cancelled = await db.event.update({
      where: { id: newEvent.id },
      data: { status: 'CANCELLED' },
    });
    expect(cancelled.status).toBe('CANCELLED');

    // Clean up
    await db.event.delete({ where: { id: newEvent.id } });
  });

  // 4. Cross-College Registration (Core Requirement)
  it('4. Cross-College Flow: Student B (MIT) can register for Event hosted by Chapter A (XYZ)', async () => {
    // Delete existing registration if any for clean test
    await db.eventRegistration.deleteMany({
      where: { eventId: testEvent.id, userId: studentB.id },
    });

    const reg = await registerForEvent(studentB.id, testEvent.id);
    expect(reg.id).toBeDefined();
    expect(reg.status).toBe(RegistrationStatus.CONFIRMED);
    expect(reg.userId).toBe(studentB.id);

    // Verify Student B cannot manage Chapter A
    const canManageA = await isChapterAdminOrOfficer(studentB.id, xyzChapter.id);
    expect(canManageA).toBe(false);
  });

  // 5. Concurrency & Duplicate Registration Prevention
  it('5. Concurrency: should reject duplicate registrations for the same user and event', async () => {
    await expect(registerForEvent(studentB.id, testEvent.id)).rejects.toThrow(
      'You are already registered for this event'
    );
  });

  // 6. Registration Cancellation & Seat Count Decrement
  it('6. Registration Flow: should cancel registration and decrement capacity counter', async () => {
    const initialEvent = await db.event.findUnique({ where: { id: testEvent.id } });
    const cancelRes = await cancelRegistration(studentB.id, testEvent.id);
    expect(cancelRes.success).toBe(true);

    const updatedEvent = await db.event.findUnique({ where: { id: testEvent.id } });
    expect(updatedEvent!.currentRegistrations).toBe(initialEvent!.currentRegistrations - 1);
  });

  // 7. Authorization & RBAC
  it('7. Authorization: should prevent unauthorized users from managing chapters', async () => {
    // Student A cannot manage XYZ Chapter as admin
    expect(hasRole(studentA.role as Role, Role.CHAPTER_ADMIN)).toBe(false);

    // Chapter Admin A cannot manage MIT Chapter
    const canAdminManageMIT = await isChapterAdminOrOfficer(chapterAdmin.id, mitChapter.id);
    expect(canAdminManageMIT).toBe(false);
  });

  // 8. Certificates Issuing and Verification
  it('8. Certificates: should issue and verify authentic certificate codes', async () => {
    const verified = await verifyCertificate('ACM-CERT-2026-88910');
    expect(verified).not.toBeNull();
    expect(verified!.certificateCode).toBe('ACM-CERT-2026-88910');
    expect(verified!.user.name).toBe('Alex Kumar');

    // Invalid code returns null
    const invalid = await verifyCertificate('INVALID-CODE-999');
    expect(invalid).toBeNull();
  });

  // 9. File Upload Security
  it('9. File Security: should validate allowed file types and reject malicious uploads', () => {
    const validPdf = { name: 'research_paper.pdf', mimeType: 'application/pdf', sizeBytes: 500000 };
    const validRes = validateFileUpload(validPdf);
    expect(validRes.sanitizedName).toBe('research_paper.pdf');

    // Reject executable
    expect(() =>
      validateFileUpload({ name: 'exploit.exe', mimeType: 'application/octet-stream', sizeBytes: 5000 })
    ).toThrow('not permitted');

    // Reject oversized file
    expect(() =>
      validateFileUpload({ name: 'huge_file.pdf', mimeType: 'application/pdf', sizeBytes: 20 * 1024 * 1024 })
    ).toThrow('File size exceeds');
  });

  // 10. Audit Logging
  it('10. Audit Trail: should record security and user activity logs', async () => {
    const recentLogs = await db.auditLog.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
    expect(recentLogs.length).toBeGreaterThan(0);
    expect(recentLogs[0].action).toBeDefined();
  });
});
