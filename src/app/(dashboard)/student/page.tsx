import Link from 'next/link';
import { redirect } from 'next/navigation';
import { 
  LayoutDashboard, UserCheck, BookOpen, Calendar, Globe, Award, 
  Settings, HelpCircle, Briefcase, FileText, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { getCurrentUser } from '@/server/security/auth';
import { db } from '@/server/db/client';

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const myRegistrations = await db.eventRegistration.findMany({
    where: { userId: user.id },
    include: { event: true },
    take: 3,
  });

  const certificates = await db.certificate.findMany({
    where: { userId: user.id },
    include: { event: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Sidebar Navigation */}
        <aside className="md:col-span-4 lg:col-span-3 bg-[#0B1E3D] text-slate-200 rounded-2xl p-4 space-y-1.5 shadow-lg h-fit">
          <div className="px-3 py-2 border-b border-slate-700/60 mb-2">
            <div className="text-[10px] font-extrabold text-[#00A3E0] uppercase tracking-wider">Student Portal</div>
          </div>
          <Link href="/student" className="acm-sidebar-link active bg-white/15 text-white shadow-sm font-bold">
            <LayoutDashboard className="w-4 h-4 text-[#00A3E0]" />
            <span>Dashboard</span>
          </Link>
          <Link href="/student/membership" className="acm-sidebar-link hover:bg-white/10">
            <UserCheck className="w-4 h-4 text-slate-300" />
            <span>My Membership</span>
          </Link>
          <Link href="/resources" className="acm-sidebar-link hover:bg-white/10">
            <BookOpen className="w-4 h-4 text-slate-300" />
            <span>Learning Center</span>
          </Link>
          <Link href="/events" className="acm-sidebar-link hover:bg-white/10">
            <Calendar className="w-4 h-4 text-slate-300" />
            <span>Events</span>
          </Link>
          <Link href="/contests" className="acm-sidebar-link hover:bg-white/10">
            <Award className="w-4 h-4 text-slate-300" />
            <span>Contests</span>
          </Link>
          <Link href="/chapters" className="acm-sidebar-link hover:bg-white/10">
            <Globe className="w-4 h-4 text-slate-300" />
            <span>Chapters</span>
          </Link>
          <Link href="/publications" className="acm-sidebar-link hover:bg-white/10">
            <FileText className="w-4 h-4 text-slate-300" />
            <span>Publications</span>
          </Link>
        </aside>

        {/* Main Content Area */}
        <main className="md:col-span-8 lg:col-span-9 space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#005596] text-white font-extrabold text-xl flex items-center justify-center border-2 border-white shadow-md flex-shrink-0">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Welcome, {user.name.split(' ')[0]}!</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Member
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  ACM ID: <strong className="text-slate-800">{user.studentId || '1234567'}</strong> • {user.institution?.name || 'XYZ College'}
                </p>
              </div>
            </div>

            <Link
              href="/student/profile"
              className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              View Profile
            </Link>
          </div>

          {/* Quick Access Grid */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Access</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/resources" className="p-4 acm-card-hover text-center space-y-2">
                <div className="w-11 h-11 mx-auto rounded-xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-900">Learning Center</div>
                <div className="text-[11px] text-slate-500 font-medium">Courses & resources</div>
              </Link>

              <Link href="/events" className="p-4 acm-card-hover text-center space-y-2">
                <div className="w-11 h-11 mx-auto rounded-xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-900">Events</div>
                <div className="text-[11px] text-slate-500 font-medium">Webinars & talks</div>
              </Link>

              <Link href="/chapters" className="p-4 acm-card-hover text-center space-y-2">
                <div className="w-11 h-11 mx-auto rounded-xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-900">Chapters</div>
                <div className="text-[11px] text-slate-500 font-medium">Find or join chapter</div>
              </Link>

              <Link href="/resources" className="p-4 acm-card-hover text-center space-y-2">
                <div className="w-11 h-11 mx-auto rounded-xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-900">Career Center</div>
                <div className="text-[11px] text-slate-500 font-medium">Jobs & opportunities</div>
              </Link>
            </div>
          </div>

          {/* Membership & Upcoming Events Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Membership Details */}
            <div className="acm-card p-5 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">My Membership</h3>
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-900">Student Membership</div>
                <div className="text-xs text-slate-600 font-medium">Valid till: May 31, 2026</div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Status: Active
                </div>
              </div>
              <Link href="/student/membership" className="block text-center px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                View Membership Details
              </Link>
            </div>

            {/* Upcoming Registered Events */}
            <div className="acm-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">Registered Events</h3>
                <Link href="/events" className="text-xs font-bold text-[#005596] hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {myRegistrations.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No event registrations found. Browse upcoming events!</p>
                ) : (
                  myRegistrations.map((reg) => {
                    const dateStr = new Date(reg.event.startTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                    return (
                      <div key={reg.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#005596] text-white font-extrabold text-xs flex flex-col items-center justify-center shadow-sm">
                            <span>{dateStr.split(' ')[0]}</span>
                            <span>{dateStr.split(' ')[1]}</span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 line-clamp-1">{reg.event.title}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{reg.event.location}</div>
                          </div>
                        </div>
                        <span className="text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {reg.status}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
