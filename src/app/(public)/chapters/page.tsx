import Link from 'next/link';
import { Globe, Users, Building, Search, PlusCircle, ArrowRight } from 'lucide-react';
import { db } from '@/server/db/client';

export default async function ChaptersPage() {
  const chapters = await db.chapter.findMany({
    where: { status: 'APPROVED' },
    include: {
      institution: true,
      _count: { select: { memberships: true, officers: true, events: true } },
    },
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#003B6E] via-[#005596] to-[#0072CE] text-white py-12 shadow-lg">
        <div className="absolute inset-0 acm-pattern-grid opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-extrabold text-[#00A3E0] uppercase tracking-wider">ACM Global Chapter Ecosystem</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">ACM Student Chapters</h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Local communities. Global impact. Join a chapter or start a new one at your institution.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a href="#find-chapter" className="px-5 py-2.5 bg-white text-[#005596] font-bold text-xs rounded-xl shadow hover:bg-blue-50 transition-all active:scale-[0.98]">
                Find a Chapter
              </a>
              <a href="#start-chapter" className="px-5 py-2.5 border border-white/40 text-white font-bold text-xs rounded-xl hover:bg-white/10 transition-all active:scale-[0.98]">
                Start a Chapter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 acm-card flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center font-bold flex-shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">1,000+</div>
              <div className="text-xs text-slate-500 font-medium">Chapters Worldwide</div>
            </div>
          </div>

          <div className="p-4 acm-card flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center font-bold flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">Student Chapters</div>
              <div className="text-xs text-slate-500 font-medium">Build local community</div>
            </div>
          </div>

          <div className="p-4 acm-card flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center font-bold flex-shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">Professional Chapters</div>
              <div className="text-xs text-slate-500 font-medium">Connect with experts</div>
            </div>
          </div>

          <div className="p-4 acm-card flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#005596] border border-blue-100 flex items-center justify-center font-bold flex-shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">SIG Groups</div>
              <div className="text-xs text-slate-500 font-medium">Special interest topics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter / Search Bar */}
      <section id="find-chapter" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Find a Chapter</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-56 relative">
              <input
                type="text"
                placeholder="Search by institution, chapter code or location..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005596] text-slate-800 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <select className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005596] bg-white font-medium text-slate-700">
              <option>All Chapter Types</option>
              <option>Student Chapter</option>
              <option>Professional Chapter</option>
            </select>
            <button className="px-5 py-2 bg-[#005596] hover:bg-[#003B6E] text-white text-xs font-bold rounded-xl shadow transition-all active:scale-[0.98]">
              Search Directory
            </button>
          </div>
        </div>

        {/* Chapter Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {chapters.map((ch) => (
            <div key={ch.id} className="acm-card-hover p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#005596]">
                  <span className="px-2.5 py-0.5 bg-blue-50 rounded-md border border-blue-100 font-mono">{ch.code}</span>
                  <span className="text-slate-500 font-normal">{ch.institution.country}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-[#005596] transition-colors">{ch.name}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{ch.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  <span className="font-bold text-slate-800">{ch._count.memberships}</span> Members •{' '}
                  <span className="font-bold text-slate-800">{ch._count.events}</span> Events
                </div>
                <Link
                  href={`/chapters/${ch.code}`}
                  className="px-3.5 py-1.5 text-xs font-bold text-[#005596] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  View Chapter
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
