import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/server/security/auth';
import { db } from '@/server/db/client';
import { Building, ArrowLeft, CheckCircle2, Save } from 'lucide-react';

export default async function ChapterAdminProfilePage() {
  const user = await getCurrentUser();
  if (!user || !['CHAPTER_ADMIN', 'CHAPTER_OFFICER', 'PLATFORM_ADMIN'].includes(user.role)) {
    redirect('/login');
  }

  const chapter = await db.chapter.findFirst({
    where: { status: 'APPROVED' },
    include: { institution: true },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Link href="/chapter-admin" className="acm-back-btn">
        <ArrowLeft className="acm-back-icon" />
        <span>Back to Chapter Admin</span>
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chapter Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage official chapter details and institutional settings.</p>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Chapter Name</label>
            <input
              type="text"
              readOnly
              value={chapter?.name || ''}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Chapter Code</label>
            <input
              type="text"
              readOnly
              value={chapter?.code || ''}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Institution</label>
            <input
              type="text"
              readOnly
              value={chapter?.institution.name || ''}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Chapter Description</label>
            <textarea
              rows={4}
              defaultValue={chapter?.description || ''}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005596]"
            />
          </div>

          <button className="px-5 py-2 bg-[#005596] hover:bg-[#003B6E] text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow">
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
