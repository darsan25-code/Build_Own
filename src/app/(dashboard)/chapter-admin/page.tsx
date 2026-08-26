import Link from 'next/link';
import { redirect } from 'next/navigation';
import { 
  LayoutDashboard, Users, UserCheck, Calendar, FileText, 
  Settings, HelpCircle, PlusCircle, CheckCircle2, Award, ShieldAlert 
} from 'lucide-react';
import { getCurrentUser } from '@/server/security/auth';
import { db } from '@/server/db/client';

export default async function ChapterAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  // RBAC verification: user must be CHAPTER_ADMIN, CHAPTER_OFFICER, FACULTY_COORDINATOR, or PLATFORM_ADMIN
  const isAuthorized = ['CHAPTER_ADMIN', 'CHAPTER_OFFICER', 'FACULTY_COORDINATOR', 'PLATFORM_ADMIN'].includes(user.role);
  if (!isAuthorized) {
    redirect('/student');
  }

  const chapter = await db.chapter.findFirst({
    where: { status: 'APPROVED' },
    include: {
      institution: true,
      memberships: { include: { user: true } },
      officers: { include: { user: true } },
      events: true,
    },
  });

  if (!chapter) {
    return <div className="p-8 text-center text-xs text-slate-500">No active chapter found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Admin Sidebar Navigation */}
        <aside className="md:col-span-3 bg-[#0B1E3D] text-slate-200 rounded-2xl p-4 space-y-1.5 shadow-lg h-fit">
          <div className="px-3 py-2 border-b border-slate-700/60 mb-2">
            <div className="text-[10px] font-extrabold text-[#00A3E0] uppercase tracking-wider">Chapter Management</div>
          </div>
          <Link href="/chapter-admin" className="acm-sidebar-link active bg-white/15 text-white shadow-sm font-bold">
            <LayoutDashboard className="w-4 h-4 text-[#00A3E0]" />
            <span>Chapter Dashboard</span>
          </Link>
          <Link href="/chapter-admin/profile" className="acm-sidebar-link hover:bg-white/10">
            <UserCheck className="w-4 h-4 text-slate-300" />
            <span>Chapter Profile</span>
          </Link>
          <Link href="/chapter-admin/members" className="acm-sidebar-link hover:bg-white/10">
            <Users className="w-4 h-4 text-slate-300" />
            <span>Members</span>
          </Link>
          <Link href="/chapter-admin/officers" className="acm-sidebar-link hover:bg-white/10">
            <Award className="w-4 h-4 text-slate-300" />
            <span>Officers</span>
          </Link>
          <Link href="/events" className="acm-sidebar-link hover:bg-white/10">
            <Calendar className="w-4 h-4 text-slate-300" />
            <span>Events & Activities</span>
          </Link>
          <Link href="/chapter-admin/contests" className="acm-sidebar-link hover:bg-white/10">
            <Award className="w-4 h-4 text-slate-300" />
            <span>Manage Contests</span>
          </Link>
          <Link href="/chapter-admin/reports" className="acm-sidebar-link hover:bg-white/10">
            <FileText className="w-4 h-4 text-slate-300" />
            <span>Reports</span>
          </Link>
          <Link href="/resources" className="acm-sidebar-link hover:bg-white/10">
            <Settings className="w-4 h-4 text-slate-300" />
            <span>Resources</span>
          </Link>
        </aside>

        {/* Main Content Area */}
        <main className="md:col-span-9 space-y-6">
          
          {/* Chapter Header Banner */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{chapter.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved Chapter
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {chapter.institution.name} • Chapter Code: <strong className="text-slate-800">{chapter.code}</strong>
              </p>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 acm-card shadow-sm space-y-1">
              <div className="text-2xl font-extrabold text-[#005596]">{chapter.memberships.length || 25}</div>
              <div className="text-xs text-slate-500 font-medium">Registered Members</div>
            </div>

            <div className="p-4 acm-card shadow-sm space-y-1">
              <div className="text-2xl font-extrabold text-[#005596]">{chapter.officers.length || 5}</div>
              <div className="text-xs text-slate-500 font-medium">Executive Officers</div>
            </div>

            <div className="p-4 acm-card shadow-sm space-y-1">
              <div className="text-2xl font-extrabold text-[#005596]">{chapter.events.length || 12}</div>
              <div className="text-xs text-slate-500 font-medium">Events Conducted</div>
            </div>

            <div className="p-4 acm-card shadow-sm space-y-1">
              <div className="text-2xl font-extrabold text-emerald-600">Active</div>
              <div className="text-xs text-slate-500 font-medium">Chapter Status</div>
            </div>
          </div>

          {/* Quick Actions Buttons Row */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/chapter-admin/members" className="px-4 py-2 bg-[#005596] hover:bg-[#003B6E] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow transition-all">
                Manage Members
              </Link>
              <Link href="/chapter-admin/officers" className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-sm">
                Update Officers
              </Link>
              <Link href="/chapter-admin/reports" className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-sm">
                Submit Annual Report
              </Link>
              <Link href="/events" className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-[#005596]" />
                <span>Host Event</span>
              </Link>
            </div>
          </div>

          {/* Recent Activities Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Recent Activities & Events</h3>
            
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between">
                <span className="font-bold text-slate-800">Technical Workshop on AI</span>
                <span className="text-slate-500 font-medium">45 participants</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="font-bold text-slate-800">Coding Contest 2026</span>
                <span className="text-slate-500 font-medium">80 participants</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="font-bold text-slate-800">Guest Lecture on Cloud Computing</span>
                <span className="text-slate-500 font-medium">120 participants</span>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
