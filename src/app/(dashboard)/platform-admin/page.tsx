import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/security/auth';
import { db } from '@/server/db/client';
import { Shield, Users, Building, AlertTriangle, FileText, CheckCircle2, XCircle } from 'lucide-react';

export default async function PlatformAdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'PLATFORM_ADMIN') {
    redirect('/login');
  }

  const stats = {
    users: await db.user.count(),
    institutions: await db.institution.count(),
    chapters: await db.chapter.count(),
    pendingChapters: await db.chapter.count({ where: { status: 'PENDING' } }),
    events: await db.event.count(),
    auditLogs: await db.auditLog.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#005596]" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Administration</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">Global governance, chapter approval, security audit monitoring, and institution oversight.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1">
          <div className="text-2xl font-extrabold text-[#005596]">{stats.users}</div>
          <div className="text-xs text-slate-500 font-medium">Total Registered Users</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1">
          <div className="text-2xl font-extrabold text-[#005596]">{stats.institutions}</div>
          <div className="text-xs text-slate-500 font-medium">Institutions</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1">
          <div className="text-2xl font-extrabold text-[#005596]">{stats.chapters}</div>
          <div className="text-xs text-slate-500 font-medium">Active Chapters</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1">
          <div className="text-2xl font-extrabold text-amber-600">{stats.pendingChapters}</div>
          <div className="text-xs text-slate-500 font-medium">Pending Chapter Approvals</div>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#005596]" />
          <span>Security Audit Trail</span>
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {stats.auditLogs.map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-[#005596]">{log.action}</span>
                <span className="text-slate-500"> on {log.resource} ({log.resourceId || 'N/A'})</span>
                <div className="text-[11px] text-slate-400">Actor: {log.actorEmail || 'System'} • IP: {log.ipAddress}</div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
