import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/server/security/auth';
import { db } from '@/server/db/client';
import { Users, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';

export default async function ChapterAdminMembersPage() {
  const user = await getCurrentUser();
  if (!user || !['CHAPTER_ADMIN', 'CHAPTER_OFFICER', 'PLATFORM_ADMIN'].includes(user.role)) {
    redirect('/login');
  }

  const chapter = await db.chapter.findFirst({
    where: { status: 'APPROVED' },
    include: { memberships: { include: { user: true } } },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <Link href="/chapter-admin" className="acm-back-btn">
        <ArrowLeft className="acm-back-icon" />
        <span>Back to Chapter Admin</span>
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Member Roster</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage chapter membership status and role assignments.</p>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {chapter?.memberships.map((mem) => (
            <div key={mem.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{mem.user.name}</div>
                <div className="text-slate-500">{mem.user.email} • Student ID: {mem.user.studentId || 'N/A'}</div>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 text-[#005596] font-semibold text-[10px] rounded">
                {mem.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
