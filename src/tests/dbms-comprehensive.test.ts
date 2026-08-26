import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../server/db/client';

describe('Comprehensive DBMS & Data Persistence Verification for All 18 Models', () => {
  const timestamp = Date.now();
  let testInstId: string;
  let testUserId1: string;
  let testUserId2: string;
  let testChapterId: string;
  let testEventId: string;
  let testTeamId: string;
  let testResourceId: string;
  let testPubId: string;
  let testCertId: string;
  let testAnnounceId: string;
  let testNotifId: string;
  let testAuditId: string;
  let testFileId: string;
  let testModId: string;

  beforeAll(async () => {
    // Clean up any old test entities if existing
  });

  afterAll(async () => {
    // Clean up created test entities cleanly
    try {
      if (testModId) await db.moderationAction.deleteMany({ where: { id: testModId } });
      if (testFileId) await db.fileAsset.deleteMany({ where: { id: testFileId } });
      if (testAuditId) await db.auditLog.deleteMany({ where: { id: testAuditId } });
      if (testNotifId) await db.notification.deleteMany({ where: { id: testNotifId } });
      if (testAnnounceId) await db.announcement.deleteMany({ where: { id: testAnnounceId } });
      if (testCertId) await db.certificate.deleteMany({ where: { id: testCertId } });
      if (testPubId) await db.publication.deleteMany({ where: { id: testPubId } });
      if (testResourceId) await db.resource.deleteMany({ where: { id: testResourceId } });
      if (testTeamId) await db.eventTeam.deleteMany({ where: { id: testTeamId } });
      if (testEventId) await db.event.deleteMany({ where: { id: testEventId } });
      if (testChapterId) await db.chapter.deleteMany({ where: { id: testChapterId } });
      if (testUserId1) await db.user.deleteMany({ where: { id: testUserId1 } });
      if (testUserId2) await db.user.deleteMany({ where: { id: testUserId2 } });
      if (testInstId) await db.institution.deleteMany({ where: { id: testInstId } });
    } catch (e) {
      console.warn('Cleanup warning:', e);
    }
  });

  // Model 1: Institution
  it('1. Institution: should create, store and read institution data correctly', async () => {
    const inst = await db.institution.create({
      data: {
        name: `Test Institution ${timestamp}`,
        code: `TEST-INST-${timestamp}`,
        domain: `test-${timestamp}.edu`,
        location: 'Test City, State',
        country: 'India',
      },
    });
    testInstId = inst.id;

    expect(inst.id).toBeDefined();
    expect(inst.code).toBe(`TEST-INST-${timestamp}`);
    expect(inst.domain).toBe(`test-${timestamp}.edu`);

    // Verify retrieval from DB
    const fetched = await db.institution.findUnique({ where: { id: inst.id } });
    expect(fetched).not.toBeNull();
    expect(fetched!.name).toBe(`Test Institution ${timestamp}`);
  });

  // Model 2: User
  it('2. User: should create, store and read full user profile and credentials correctly', async () => {
    const user1 = await db.user.create({
      data: {
        name: `Test User One ${timestamp}`,
        email: `testuser1_${timestamp}@test.edu`,
        passwordHash: '$2a$12$eX4mP1eH4sh3dPa55w0rdStr1ngF0rT3st1ng0nly0000000000000',
        role: 'CHAPTER_ADMIN',
        accountType: 'Student',
        isVerified: true,
        studentId: `STU-${timestamp}-01`,
        department: 'Computer Engineering',
        yearOfStudy: '4th Year',
        institutionId: testInstId,
      },
    });
    testUserId1 = user1.id;

    const user2 = await db.user.create({
      data: {
        name: `Test User Two ${timestamp}`,
        email: `testuser2_${timestamp}@test.edu`,
        passwordHash: '$2a$12$eX4mP1eH4sh3dPa55w0rdStr1ngF0rT3st1ng0nly0000000000000',
        role: 'STUDENT',
        accountType: 'Student',
        isVerified: true,
        studentId: `STU-${timestamp}-02`,
        department: 'Information Technology',
        yearOfStudy: '2nd Year',
        institutionId: testInstId,
      },
    });
    testUserId2 = user2.id;

    expect(user1.id).toBeDefined();
    expect(user2.id).toBeDefined();

    // Verify DB fetch with relation
    const fetchedUser = await db.user.findUnique({
      where: { id: user1.id },
      include: { institution: true },
    });
    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser!.institution?.code).toBe(`TEST-INST-${timestamp}`);
    expect(fetchedUser!.department).toBe('Computer Engineering');
  });

  // Model 3: Chapter
  it('3. Chapter: should create and associate chapter with institution', async () => {
    const chapter = await db.chapter.create({
      data: {
        name: `Test ACM Chapter ${timestamp}`,
        code: `ACM-TEST-${timestamp}`,
        type: 'Student Chapter',
        status: 'APPROVED',
        description: 'Comprehensive test chapter description',
        foundedYear: 2026,
        institutionId: testInstId,
      },
    });
    testChapterId = chapter.id;

    expect(chapter.id).toBeDefined();
    expect(chapter.status).toBe('APPROVED');

    const fetched = await db.chapter.findUnique({
      where: { id: chapter.id },
      include: { institution: true },
    });
    expect(fetched!.institution.id).toBe(testInstId);
  });

  // Model 4: ChapterMembership
  it('4. ChapterMembership: should record membership and enforce unique user-chapter pairing', async () => {
    const membership = await db.chapterMembership.create({
      data: {
        chapterId: testChapterId,
        userId: testUserId2,
        role: 'CHAPTER_MEMBER',
        status: 'ACTIVE',
      },
    });

    expect(membership.id).toBeDefined();
    expect(membership.status).toBe('ACTIVE');

    // Duplicate membership must be rejected by DBMS unique constraint
    await expect(
      db.chapterMembership.create({
        data: {
          chapterId: testChapterId,
          userId: testUserId2,
          role: 'CHAPTER_MEMBER',
        },
      })
    ).rejects.toThrow();
  });

  // Model 5: ChapterOfficer
  it('5. ChapterOfficer: should record chapter officer role with position constraint', async () => {
    const officer = await db.chapterOfficer.create({
      data: {
        chapterId: testChapterId,
        userId: testUserId1,
        position: 'CHAIR',
        title: 'Chapter Chairperson',
        active: true,
      },
    });

    expect(officer.id).toBeDefined();
    expect(officer.position).toBe('CHAIR');

    // Duplicate officer position for same user and chapter must be rejected
    await expect(
      db.chapterOfficer.create({
        data: {
          chapterId: testChapterId,
          userId: testUserId1,
          position: 'CHAIR',
          title: 'Duplicate Chair',
        },
      })
    ).rejects.toThrow();
  });

  // Model 6: Event
  it('6. Event: should create, persist, and retrieve complete event metadata', async () => {
    const startTime = new Date(Date.now() + 5 * 86400000);
    const endTime = new Date(startTime.getTime() + 7200000);
    const regDeadline = new Date(Date.now() + 3 * 86400000);

    const event = await db.event.create({
      data: {
        title: `Test Hackathon Event ${timestamp}`,
        slug: `test-hackathon-${timestamp}`,
        description: 'Testing event persistence and relational mapping',
        type: 'HACKATHON',
        format: 'HYBRID',
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        maxCapacity: 120,
        currentRegistrations: 0,
        isPaid: false,
        price: 0.0,
        startTime,
        endTime,
        registrationDeadline: regDeadline,
        location: 'Main Auditorium / Online',
        meetingUrl: 'https://meet.acm.org/test',
        certificateEligible: true,
        chapterId: testChapterId,
        institutionId: testInstId,
      },
    });
    testEventId = event.id;

    expect(event.id).toBeDefined();
    expect(event.slug).toBe(`test-hackathon-${timestamp}`);
    expect(event.certificateEligible).toBe(true);

    const fetched = await db.event.findUnique({
      where: { id: event.id },
      include: { chapter: true, institution: true },
    });
    expect(fetched!.chapter.id).toBe(testChapterId);
    expect(fetched!.institution!.id).toBe(testInstId);
  });

  // Model 7: EventOrganizer
  it('7. EventOrganizer: should assign organizer role to user for an event', async () => {
    const organizer = await db.eventOrganizer.create({
      data: {
        eventId: testEventId,
        userId: testUserId1,
        role: 'LEAD_ORGANIZER',
      },
    });

    expect(organizer.id).toBeDefined();
    expect(organizer.role).toBe('LEAD_ORGANIZER');

    const fetched = await db.eventOrganizer.findUnique({
      where: { eventId_userId: { eventId: testEventId, userId: testUserId1 } },
    });
    expect(fetched).not.toBeNull();
  });

  // Model 8: EventTeam & Model 9: EventParticipant
  it('8 & 9. EventTeam and EventParticipant: should store team structure and member relations', async () => {
    const team = await db.eventTeam.create({
      data: {
        eventId: testEventId,
        name: `Team Delta ${timestamp}`,
        leaderId: testUserId1,
        inviteCode: `INV-TEAM-${timestamp}`,
        maxMembers: 4,
      },
    });
    testTeamId = team.id;

    expect(team.id).toBeDefined();
    expect(team.inviteCode).toBe(`INV-TEAM-${timestamp}`);

    // Add participant
    const participant = await db.eventParticipant.create({
      data: {
        teamId: team.id,
        userId: testUserId2,
        role: 'DEVELOPER',
      },
    });
    expect(participant.id).toBeDefined();

    // Verify team members retrieval
    const fetchedTeam = await db.eventTeam.findUnique({
      where: { id: team.id },
      include: { leader: true, participants: { include: { user: true } } },
    });
    expect(fetchedTeam!.leader.id).toBe(testUserId1);
    expect(fetchedTeam!.participants.length).toBe(1);
    expect(fetchedTeam!.participants[0].userId).toBe(testUserId2);
  });

  // Model 10: EventRegistration
  it('10. EventRegistration: should store registration with unique codes and team link', async () => {
    const regCode = `REG-TEST-${timestamp}`;
    const registration = await db.eventRegistration.create({
      data: {
        eventId: testEventId,
        userId: testUserId2,
        teamId: testTeamId,
        status: 'CONFIRMED',
        registrationCode: regCode,
        attended: false,
      },
    });

    expect(registration.id).toBeDefined();
    expect(registration.registrationCode).toBe(regCode);
    expect(registration.teamId).toBe(testTeamId);

    // Verify composite unique rejection on duplicate registration
    await expect(
      db.eventRegistration.create({
        data: {
          eventId: testEventId,
          userId: testUserId2,
          registrationCode: `REG-DUP-${timestamp}`,
          status: 'CONFIRMED',
        },
      })
    ).rejects.toThrow();
  });

  // Model 11: Resource
  it('11. Resource: should create and track educational resource and download counter', async () => {
    const resource = await db.resource.create({
      data: {
        title: `AI & Machine Learning Handbook ${timestamp}`,
        category: 'STUDY_MATERIAL',
        type: 'PDF',
        url: `https://storage.acm.org/resources/handbook-${timestamp}.pdf`,
        description: 'Comprehensive study material for competitive programming',
        isPublic: true,
        downloadCount: 0,
        chapterId: testChapterId,
        authorId: testUserId1,
      },
    });
    testResourceId = resource.id;

    expect(resource.id).toBeDefined();
    expect(resource.downloadCount).toBe(0);

    // Update download counter
    const updated = await db.resource.update({
      where: { id: resource.id },
      data: { downloadCount: { increment: 5 } },
    });
    expect(updated.downloadCount).toBe(5);
  });

  // Model 12: Publication
  it('12. Publication: should store academic publications and author metadata', async () => {
    const pub = await db.publication.create({
      data: {
        title: `Efficient Neural Optimization in Distributed Clusters ${timestamp}`,
        type: 'Conference Paper',
        abstract: 'Novel techniques for gradient synchronization across decentralized nodes.',
        pdfUrl: `https://storage.acm.org/pubs/paper-${timestamp}.pdf`,
        doi: `10.1145/test.${timestamp}`,
        chapterId: testChapterId,
        authorId: testUserId1,
      },
    });
    testPubId = pub.id;

    expect(pub.id).toBeDefined();
    expect(pub.doi).toBe(`10.1145/test.${timestamp}`);

    const fetched = await db.publication.findUnique({
      where: { id: pub.id },
      include: { author: true, chapter: true },
    });
    expect(fetched!.author.id).toBe(testUserId1);
    expect(fetched!.chapter!.id).toBe(testChapterId);
  });

  // Model 13: Certificate
  it('13. Certificate: should persist verifiable certificates and track verification count', async () => {
    const certCode = `ACM-CERT-TEST-${timestamp}`;
    const cert = await db.certificate.create({
      data: {
        certificateCode: certCode,
        userId: testUserId2,
        eventId: testEventId,
        pdfAssetUrl: `/certificates/${certCode}`,
        verifiedCount: 0,
      },
    });
    testCertId = cert.id;

    expect(cert.id).toBeDefined();
    expect(cert.certificateCode).toBe(certCode);

    // Verify certificate verification counter increment
    const verified = await db.certificate.update({
      where: { certificateCode: certCode },
      data: { verifiedCount: { increment: 1 } },
      include: { user: true, event: true },
    });
    expect(verified.verifiedCount).toBe(1);
    expect(verified.user.id).toBe(testUserId2);
    expect(verified.event.id).toBe(testEventId);
  });

  // Model 14: Announcement
  it('14. Announcement: should persist announcements with pinning and scope', async () => {
    const announcement = await db.announcement.create({
      data: {
        title: `Important Chapter Announcement ${timestamp}`,
        content: 'Registration for the regional hackathon is now open for all members.',
        scope: 'CHAPTER',
        isPinned: true,
        chapterId: testChapterId,
        authorId: testUserId1,
      },
    });
    testAnnounceId = announcement.id;

    expect(announcement.id).toBeDefined();
    expect(announcement.isPinned).toBe(true);

    const fetched = await db.announcement.findUnique({
      where: { id: announcement.id },
      include: { author: true },
    });
    expect(fetched!.author.name).toBe(`Test User One ${timestamp}`);
  });

  // Model 15: Notification
  it('15. Notification: should store user notifications and support read status toggling', async () => {
    const notif = await db.notification.create({
      data: {
        userId: testUserId2,
        title: 'Event Registration Confirmed',
        message: 'Your registration for Test Hackathon has been confirmed.',
        type: 'SUCCESS',
        link: `/events/test-hackathon-${timestamp}`,
        isRead: false,
      },
    });
    testNotifId = notif.id;

    expect(notif.id).toBeDefined();
    expect(notif.isRead).toBe(false);

    // Mark as read
    const markedRead = await db.notification.update({
      where: { id: notif.id },
      data: { isRead: true },
    });
    expect(markedRead.isRead).toBe(true);
  });

  // Model 16: AuditLog
  it('16. AuditLog: should store immutable security and system audit logs with full actor metadata', async () => {
    const log = await db.auditLog.create({
      data: {
        actorId: testUserId1,
        actorEmail: `testuser1_${timestamp}@test.edu`,
        action: 'EVENT_CREATED',
        resource: 'Event',
        resourceId: testEventId,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        correlationId: `corr-${timestamp}`,
        details: JSON.stringify({ title: `Test Hackathon Event ${timestamp}`, maxCapacity: 120 }),
      },
    });
    testAuditId = log.id;

    expect(log.id).toBeDefined();
    expect(log.action).toBe('EVENT_CREATED');
    expect(log.resource).toBe('Event');

    const fetched = await db.auditLog.findUnique({
      where: { id: log.id },
      include: { actor: true },
    });
    expect(fetched!.actor?.id).toBe(testUserId1);
    expect(fetched!.correlationId).toBe(`corr-${timestamp}`);
  });

  // Model 17: FileAsset
  it('17. FileAsset: should store uploaded file metadata and storage references', async () => {
    const file = await db.fileAsset.create({
      data: {
        originalName: 'presentation_slides.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 2048576,
        storageKey: `uploads/test-${timestamp}-slides.pdf`,
        publicUrl: `/uploads/test-${timestamp}-slides.pdf`,
        category: 'PRESENTATION',
        uploaderId: testUserId1,
      },
    });
    testFileId = file.id;

    expect(file.id).toBeDefined();
    expect(file.storageKey).toBe(`uploads/test-${timestamp}-slides.pdf`);
    expect(file.sizeBytes).toBe(2048576);

    const fetched = await db.fileAsset.findUnique({
      where: { id: file.id },
      include: { uploader: true },
    });
    expect(fetched!.uploader.id).toBe(testUserId1);
  });

  // Model 18: ModerationAction
  it('18. ModerationAction: should store administrative moderation actions', async () => {
    const mod = await db.moderationAction.create({
      data: {
        targetType: 'Resource',
        targetId: testResourceId,
        action: 'FLAG_VERIFIED',
        reason: 'Content verified against community guidelines and copyright standards',
        moderatorId: testUserId1,
      },
    });
    testModId = mod.id;

    expect(mod.id).toBeDefined();
    expect(mod.targetType).toBe('Resource');
    expect(mod.action).toBe('FLAG_VERIFIED');

    const fetched = await db.moderationAction.findUnique({
      where: { id: mod.id },
    });
    expect(fetched).not.toBeNull();
    expect(fetched!.moderatorId).toBe(testUserId1);
  });

  // ACID & Transaction Integrity
  it('19. ACID Transactions: should atomicity commit all steps or rollback on failure', async () => {
    const uniqueSlug = `tx-event-${timestamp}`;

    // Test successful transaction
    await db.$transaction(async (tx) => {
      const txEvent = await tx.event.create({
        data: {
          title: `TX Event ${timestamp}`,
          slug: uniqueSlug,
          description: 'Transaction test event',
          type: 'WORKSHOP',
          startTime: new Date(Date.now() + 86400000),
          endTime: new Date(Date.now() + 90000000),
          registrationDeadline: new Date(Date.now() + 80000000),
          chapterId: testChapterId,
        },
      });

      await tx.notification.create({
        data: {
          userId: testUserId1,
          title: 'Event Scheduled',
          message: `Event ${txEvent.title} is now scheduled.`,
        },
      });
    });

    const createdTxEvent = await db.event.findUnique({ where: { slug: uniqueSlug } });
    expect(createdTxEvent).not.toBeNull();

    // Test rollback on failure
    await expect(
      db.$transaction(async (tx) => {
        await tx.event.update({
          where: { id: createdTxEvent!.id },
          data: { title: 'Should Not Persist Because Following Step Will Fail' },
        });

        // Deliberately trigger unique constraint failure
        await tx.institution.create({
          data: {
            name: 'Duplicate Code Inst',
            code: `TEST-INST-${timestamp}`, // Duplicate code will violate unique constraint
            location: 'Nowhere',
          },
        });
      })
    ).rejects.toThrow();

    // Verify rollback: the title should remain unchanged
    const eventAfterRollback = await db.event.findUnique({ where: { slug: uniqueSlug } });
    expect(eventAfterRollback!.title).toBe(`TX Event ${timestamp}`);

    // Cleanup
    await db.event.delete({ where: { id: createdTxEvent!.id } });
  });
});
