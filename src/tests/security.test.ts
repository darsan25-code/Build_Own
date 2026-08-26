import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, hasRole } from '../server/security/auth';
import { validateFileUpload } from '../server/services/securityService';
import { Role } from '../types/index';

describe('Security & Authorization Foundation', () => {
  it('should securely hash and verify passwords using bcrypt', async () => {
    const raw = 'SecureP@ssw0rd!';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);

    const valid = await verifyPassword(raw, hash);
    expect(valid).toBe(true);

    const invalid = await verifyPassword('WrongPassword', hash);
    expect(invalid).toBe(false);
  });

  it('should enforce strict 7-tier RBAC role hierarchy', () => {
    expect(hasRole(Role.PLATFORM_ADMIN, Role.CHAPTER_ADMIN)).toBe(true);
    expect(hasRole(Role.CHAPTER_ADMIN, Role.STUDENT)).toBe(true);
    expect(hasRole(Role.STUDENT, Role.PLATFORM_ADMIN)).toBe(false);
    expect(hasRole(Role.PUBLIC_USER, Role.STUDENT)).toBe(false);
  });

  it('should enforce strict file upload MIME types and size limits', () => {
    const validFile = { name: 'certificate.pdf', mimeType: 'application/pdf', sizeBytes: 1024 * 1024 };
    const res = validateFileUpload(validFile);
    expect(res.sanitizedName).toBe('certificate.pdf');

    expect(() =>
      validateFileUpload({ name: 'malicious.exe', mimeType: 'application/x-msdownload', sizeBytes: 1024 })
    ).toThrow('not permitted');

    expect(() =>
      validateFileUpload({ name: 'large.png', mimeType: 'image/png', sizeBytes: 15 * 1024 * 1024 })
    ).toThrow('File size exceeds');
  });
});
