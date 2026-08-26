import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/server/security/auth';
import { FileText, ArrowLeft, Send } from 'lucide-react';

export default async function ChapterAdminReportsPage() {
  const user = await getCurrentUser();
  if (!user || !['CHAPTER_ADMIN', 'CHAPTER_OFFICER', 'PLATFORM_ADMIN'].includes(user.role)) {
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Link href="/chapter-admin" className="acm-back-btn">
        <ArrowLeft className="acm-back-icon" />
        <span>Back to Chapter Admin</span>
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Annual Reports & Filing</h1>
          <p className="text-xs text-slate-500 mt-0.5">Submit mandatory annual activity and financial reports to ACM Headquarters.</p>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Report Academic Term</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
              <option>2025 – 2026 Academic Term</option>
              <option>2024 – 2025 Academic Term</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Executive Summary of Chapter Activities</label>
            <textarea
              rows={5}
              placeholder="Describe workshops, tech talks, coding contests, and community outreach conducted during the term..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005596]"
            />
          </div>

          <button className="px-5 py-2.5 bg-[#005596] hover:bg-[#003B6E] text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow">
            <Send className="w-3.5 h-3.5" />
            <span>Submit Annual Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
