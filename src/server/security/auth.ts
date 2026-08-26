import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { Role } from '@/types';
import { db } from '../db/client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'acm-secure-secret-key-32-chars-long-for-jwt-signing!!'
);
const COOKIE_NAME = 'acm_session';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  institutionId?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      institution: true,
      memberships: {
        include: { chapter: true }
      },
      officerRoles: {
        include: { chapter: true }
      }
    }
  });

  if (!user || user.deletedAt) return null;
  return user;
}

export const getSessionUser = getCurrentUser;

// RBAC & ABAC Server Guards
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy: Record<Role, number> = {
    PUBLIC_USER: 0,
    STUDENT: 1,
    CHAPTER_MEMBER: 2,
    CHAPTER_OFFICER: 3,
    CHAPTER_ADMIN: 4,
    FACULTY_COORDINATOR: 5,
    PLATFORM_ADMIN: 6,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export async function isChapterAdminOrOfficer(userId: string, chapterId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  if (user.role === Role.PLATFORM_ADMIN) return true;

  const officer = await db.chapterOfficer.findFirst({
    where: {
      userId,
      chapterId,
      active: true,
    },
  });
  if (officer) return true;

  const adminMembership = await db.chapterMembership.findFirst({
    where: {
      userId,
      chapterId,
      role: { in: [Role.CHAPTER_ADMIN, Role.FACULTY_COORDINATOR] },
      status: 'ACTIVE',
    },
  });

  return !!adminMembership;
}
