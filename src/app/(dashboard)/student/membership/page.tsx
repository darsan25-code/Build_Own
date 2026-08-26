import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/server/security/auth';
import { UserCheck, CheckCircle2, Award, Calendar, ArrowLeft, Shield } from 'lucide-react';

export default async function StudentMembershipPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Link href="/student" className="acm-back-btn">
        <ArrowLeft className="acm-back-icon" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Membership Details</h1>
            <p className="text-xs text-slate-500 mt-0.5">Verified ACM Student Member Credentials</p>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active Membership
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-500 font-medium">Member Name</span>
            <div className="font-bold text-slate-900 text-sm">{user.name}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-500 font-medium">ACM Student ID</span>
            <div className="font-bold text-slate-900 text-sm">{user.studentId || '1234567'}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-500 font-medium">Institution</span>
            <div className="font-bold text-slate-900 text-sm">{user.institution?.name || 'XYZ College'}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-500 font-medium">Validity Period</span>
            <div className="font-bold text-slate-900 text-sm">May 2024 — May 2026</div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-[#005596] space-y-2">
          <h4 className="font-bold flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Member Privileges Active
          </h4>
          <p className="text-slate-600 leading-relaxed">
            Your active student status grants you full access to ACM Learning Center skill paths, Digital Library publications, and event registration privileges across all global ACM Student Chapters.
          </p>
        </div>
      </div>
    </div>
  );
}
