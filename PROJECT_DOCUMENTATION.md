# ACM Student Chapter & Technical Community Platform — Complete Project Documentation

A production-grade, multi-institution **ACM Student Chapter and Technical Community Platform** inspired by official ACM digital portals and competitive academic/event platforms like Unstop.

---

## 1. Executive Summary & Product Architecture

The platform connects students across multiple academic institutions, ACM chapter members, chapter officers, chapter administrators, faculty coordinators, public participants, and platform administrators into a unified digital ecosystem.

### Core Capabilities
- **Multi-College & Open Public Event Participation**: Students from non-host institutions can discover and register for eligible public events without mandatory chapter membership.
- **Chapter-Level & Platform-Wide Governance**: Supports isolated institution/chapter data boundaries alongside platform-wide discovery and metrics.
- **7-Tier Hierarchical RBAC + ABAC**: Server-side role enforcement coupled with resource ownership and chapter scoping.
- **Transaction-Safe Concurrency & Overbooking Prevention**: Database-level unique constraints (`[eventId, userId]`) and Prisma `$transaction` capacity management.
- **Security & Anti-Abuse Protection**: Sliding window rate limiting, salted password hashing, HTTP-only secure cookie session management, anti-IDOR resource guards, safe file upload validation, and immutable audit logging.

---

## 2. Technology Stack & Project Structure

```
ACM_WEB/
├── prisma/
│   ├── schema.prisma        # Database models & relationships
│   └── dev.db               # SQLite / Postgres compatible database
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login & Sign Up pages
│   │   ├── (public)/        # Home, Chapters, Events, Publications, Resources
│   │   ├── (dashboard)/     # Student, Chapter Admin & Platform Admin dashboards
│   │   ├── api/             # Auth, Events & Health API route handlers
│   │   ├── globals.css      # Custom ACM design tokens & Tailwind utilities
│   │   └── layout.tsx       # Global RootLayout with Navbar and Footer
│   ├── components/
│   │   └── layout/          # Navbar, Footer, Sidebar navigation components
│   ├── server/
│   │   ├── db/              # Prisma client singleton & seed script
│   │   ├── security/        # Auth, JWT session manager, Rate limiter, Audit logger
│   │   └── services/        # Event service, Security service, Certificate service
│   ├── types/               # TypeScript enums & system interface declarations
│   └── tests/               # Vitest integration & security unit test suites
├── e2e/                     # Playwright end-to-end user journey tests
├── tailwind.config.js       # ACM academic color scheme configuration
├── vitest.config.ts         # Vitest test runner setup
├── playwright.config.ts     # Playwright E2E configuration
└── package.json             # Package scripts & dependencies
```

---

## 3. Hierarchical Role-Based Access Control (RBAC & ABAC)

| Role | Hierarchy Level | Capabilities & Access Scope |
| :--- | :---: | :--- |
| `PUBLIC_USER` | 0 | Unauthenticated public visitor. Can browse public events, chapters directory, publications, and learning resources. |
| `STUDENT` | 1 | Authenticated student. Can register for public events across any host chapter, view profile, manage registered events, and download certificates. |
| `CHAPTER_MEMBER` | 2 | Verified member of a specific chapter. Has access to private chapter events, member-only announcements, and learning content. |
| `CHAPTER_OFFICER` | 3 | Elected chapter leader (e.g., Vice Chair, Treasurer). Can organize chapter events, mark attendance, and manage event logistics. |
| `CHAPTER_ADMIN` | 4 | Executive chapter admin. Can manage member rosters, promote/demote officers, edit chapter profile, and submit annual reports. |
| `FACULTY_COORDINATOR` | 5 | Academic faculty advisor. Oversees chapter compliance, approves events, and manages academic publications. |
| `PLATFORM_ADMIN` | 6 | Global system owner. Manages global users, institution approvals, chapter status overrides, event moderation, and security audit logs. |

---

## 4. Complete Database Schema (Prisma)

```prisma
model Institution {
  id        String   @id @default(uuid())
  name      String
  code      String   @unique
  domain    String?  @unique
  location  String
  country   String   @default("USA")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users    User[]
  chapters Chapter[]
  events   Event[]
}

model User {
  id             String    @id @default(uuid())
  email          String    @unique
  passwordHash   String
  name           String
  role           String    @default("STUDENT")
  accountType    String    @default("Student")
  isVerified     Boolean   @default(false)
  mfaEnabled     Boolean   @default(false)
  failedAttempts Int       @default(0)
  lockedUntil    DateTime?
  avatarUrl      String?
  studentId      String?
  department     String?
  yearOfStudy    String?
  
  institutionId  String?
  institution    Institution? @relation(fields: [institutionId], references: [id], onDelete: SetNull)

  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime?

  memberships    ChapterMembership[]
  officerRoles   ChapterOfficer[]
  registrations  EventRegistration[]
  certificates   Certificate[]
  auditLogs      AuditLog[]           @relation("ActorAuditLogs")
  notifications  Notification[]
  resources      Resource[]
  publications   Publication[]
}

model Chapter {
  id            String   @id @default(uuid())
  name          String
  code          String   @unique
  type          String   @default("Student")
  status        String   @default("PENDING")
  description   String
  institutionId String
  institution   Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade)

  memberships   ChapterMembership[]
  officers      ChapterOfficer[]
  events        Event[]
  resources     Resource[]
  publications  Publication[]
}

model Event {
  id                   String      @id @default(uuid())
  title                String
  slug                 String      @unique
  description          String
  type                 String      @default("TECHNICAL_TALK")
  format               String      @default("ONLINE")
  status               String      @default("PUBLISHED")
  visibility           String      @default("PUBLIC")
  maxCapacity          Int         @default(100)
  currentRegistrations Int         @default(0)
  startTime            DateTime
  endTime              DateTime
  registrationDeadline DateTime
  location             String      @default("Online")
  certificateEligible  Boolean     @default(true)
  chapterId            String
  chapter              Chapter      @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  registrations        EventRegistration[]
  certificates         Certificate[]
}

model EventRegistration {
  id               String             @id @default(uuid())
  eventId          String
  userId           String
  status           String             @default("CONFIRMED")
  registrationCode String             @unique
  attended         Boolean            @default(false)
  registeredAt     DateTime           @default(now())

  event            Event              @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user             User               @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([eventId, userId])
}

model Certificate {
  id              String   @id @default(uuid())
  certificateCode String   @unique
  userId          String
  eventId         String
  issuedAt        DateTime @default(now())
  pdfAssetUrl     String

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@unique([userId, eventId])
}

model AuditLog {
  id            String   @id @default(uuid())
  actorId       String?
  actorEmail    String?
  action        String
  resource      String
  resourceId    String?
  ipAddress     String?
  correlationId String?
  details       String?
  createdAt     DateTime @default(now())

  actor User? @relation("ActorAuditLogs", fields: [actorId], references: [id], onDelete: SetNull)
}
```

---

## 5. Security & Anti-Abuse Implementations

### A. Authentication & Session Management
- **Password Security**: Passwords are never stored in plaintext. Hashed with **bcrypt** (12 salt rounds).
- **Session Tokens**: Signed **JOSE JWT tokens** stored in `HttpOnly`, `SameSite: lax` secure cookies (`acm_session`).
- **Account Lockout**: Tracks `failedAttempts`. 5 consecutive failed attempts lock the account for 15 minutes.

### B. Transaction-Safe Registration Engine
```ts
// Excerpt from src/server/services/eventService.ts
export async function registerForEvent(userId: string, eventId: string) {
  return db.$transaction(async (tx) => {
    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (event.status !== 'PUBLISHED') throw new Error('Event not active.');
    
    // Composite unique check prevents duplicate registration
    const existing = await tx.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } }
    });
    if (existing) throw new Error('You are already registered.');

    const currentCount = await tx.eventRegistration.count({
      where: { eventId, status: 'CONFIRMED' }
    });

    const status = currentCount >= event.maxCapacity ? 'WAITLISTED' : 'CONFIRMED';
    const reg = await tx.eventRegistration.create({
      data: { eventId, userId, registrationCode: `REG-${Date.now()}`, status }
    });

    if (status === 'CONFIRMED') {
      await tx.event.update({
        where: { id: eventId },
        data: { currentRegistrations: { increment: 1 } }
      });
    }

    return reg;
  });
}
```

### C. Rate Limiting Middleware
Sliding-window token bucket algorithm limits sensitive requests:
- `/api/auth/login`: Max 10 attempts per minute per IP.
- `/api/auth/register`: Max 5 attempts per minute per IP.
- `/api/events/register`: Max 5 registrations per minute per user.

### D. File Security & Anti-Path Traversal
MIME-type whitelisting (`application/pdf`, `image/png`, `image/jpeg`), 10MB file ceiling, dangerous file extension blocking (`.exe`, `.sh`, `.php`), and sanitized storage keys.

---

## 6. Implementation of Reference UI (10 Views)

1. **Home Page (`/`)**: ACM Azure gradient hero (`Advancing Computing as a Science & Profession`), 4 feature modules, platform counter banner, upcoming highlight events.
2. **Sign Up Page (`/signup`)**: 4-step onboarding indicator, form inputs (Full Name, Email, Password, Account Type).
3. **Login Page (`/login`)**: Hero quote card (*"Computing powers a better tomorrow."*), credentials form, password toggle, quick demo login shortcuts.
4. **Student Dashboard (`/student`)**: Sidebar navigation, Welcome Alex header, Active membership badge, Quick Access grid, registered events list.
5. **Chapters Page (`/chapters`)**: Hero banner, global chapter counters, institution search/filter bar, chapter cards grid.
6. **Events Page (`/events`)**: Upcoming/Past tabs, filter dropdowns (Type, Location, Date), event list rows with date badges (APR 25, MAY 10), direct registration button.
7. **Publications Page (`/publications`)**: Category filter tabs, research publication cards (ACM Transactions on Computing, ACM Digital Library).
8. **Learning Center (`/resources`)**: 8 skill category cards (Online Courses, Skill Paths, Webinars, Technical Articles, Career Center).
9. **Chapter Admin Interface (`/chapter-admin`)**: XYZ College Chapter header, stats counters (25 Members, 5 Officers, 12 Events), quick action buttons, recent activity table.
10. **Profile Page (`/student/profile`)**: User profile card with avatar, member ID (1234567), department, year of study, location, valid membership dates.

---

## 7. Verification & Test Results

### Vitest Unit & Integration Tests
- Command: `npx vitest run`
- Output: **`3 passed (3/3 tests)`**
  - Password hashing & salt verification (`bcrypt`)
  - 7-tier RBAC role hierarchy validation (`hasRole`)
  - File upload MIME type and size restriction enforcement (`validateFileUpload`)

### Next.js Production Build
- Command: `npm run build`
- Output: **`✓ Compiled successfully`**, **`✓ Generating static pages (21/21)`**

---

## 8. Quick Start Guide & Demo Credentials

### Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Push database schema & seed demo data
npx prisma db push
npx tsx src/server/db/seed.ts

# 3. Start production server
npm start
```
Server runs at **`http://localhost:3000`**.

### Demo Credentials
- **Student Member**: `alex@xyz.edu` / `Password123!`
- **Chapter Admin**: `chapteradmin@xyz.edu` / `Password123!`
- **Platform Admin**: `admin@acm.org` / `Password123!`
