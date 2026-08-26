import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/server/security/auth';
import { db } from '@/server/db/client';
import { Award, ArrowLeft, Plus } from 'lucide-react';

export default async function ChapterAdminOfficersPage() {
  const user = await getCurrentUser();
  if (!user || !['CHAPTER_ADMIN', 'CHAPTER_OFFICER', 'PLATFORM_ADMIN'].includes(user.role)) {
    redirect('/login');
  }

  const chapter = await db.chapter.findFirst({
    where: { status: 'APPROVED' },
    include: { officers: { include: { user: true } } },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <Link href="/chapter-admin" className="acm-back-btn">
        <ArrowLeft className="acm-back-icon" />
        <span>Back to Chapter Admin</span>
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chapter Officers</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage executive officer appointments and leadership terms.</p>
          </div>
          <button className="px-4 py-2 bg-[#005596] hover:bg-[#003B6E] text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow">
            <Plus className="w-4 h-4" />
            <span>Add Officer</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {chapter?.officers.map((off) => (
            <div key={off.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{off.user.name}</div>
                <div className="text-slate-500">{off.user.email}</div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-semibold text-[10px] rounded">
                {off.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
